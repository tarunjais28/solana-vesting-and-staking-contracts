import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  createMint,
  mintToChecked,
  getAccount,
} from "@solana/spl-token";
import { SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { BN } from "bn.js";
import { assert } from "chai";

import { Vesting } from "../target/types/vesting";

const sleep = async (seconds) => {
  await new Promise((f) => setTimeout(f, 1000 * seconds));
};

describe("vesting", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Vesting as Program<Vesting>;

  // Create test keypairs
  const admin = anchor.web3.Keypair.generate();
  const payer = anchor.web3.Keypair.generate();
  const vault = anchor.web3.Keypair.generate();
  const user1 = anchor.web3.Keypair.generate();
  const user2 = anchor.web3.Keypair.generate();
  const mintAuthority = anchor.web3.Keypair.generate();

  // Create constant amount fields
  const DECIMALS = 3;
  const MINT_AMOUNT = 20 * Math.pow(10, DECIMALS);
  const STAKE_AMOUNT = 15 * Math.pow(10, DECIMALS);
  const PERCENT_100 = new BN(Math.pow(10, DECIMALS + 2));
  const PERCENT_75 = new BN(75 * Math.pow(10, DECIMALS));
  const PERCENT_50 = new BN(5 * Math.pow(10, DECIMALS + 1));
  const PERCENT_25 = new BN(25 * Math.pow(10, DECIMALS));
  const MONTHLY_TIMESTAMP = program.idl.constants[0].value;

  // Declare PDAs
  let pdaGlobalAccount,
    pdaEscrow = null;

  // Declare nft mints
  let mintAccount = null;

  function calcShare(amount, percentage) {
    return (amount * percentage) / PERCENT_100;
  }

  const confirmTransaction = async (tx) => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
  };

  const stake = async (streamParams) => {
    // Get stake PDA
    const [pdaStakeAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("lock"), vault.publicKey.toBytes()],
      program.programId
    );

    // Get user's token associated account
    let vaultATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      mintAccount,
      vault.publicKey
    );

    // Mint tokens to user
    await mintToChecked(
      provider.connection,
      payer,
      mintAccount,
      vaultATA.address,
      mintAuthority,
      MINT_AMOUNT,
      DECIMALS
    );

    // Test stake instruction
    let stake = await program.methods
      .stake(streamParams)
      .accounts({
        globalState: pdaGlobalAccount,
        stream: pdaStakeAccount,
        escrowAccount: pdaEscrow,
        userVault: vaultATA.address,
        authority: vault.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([vault])
      .rpc();

    await confirmTransaction(stake);
  };

  const claim = async (vault, recipient) => {
    // Get stake PDA
    const [pdaStakeAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("lock"), vault.publicKey.toBytes()],
      program.programId
    );

    let recipientATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      mintAccount,
      recipient.publicKey
    );

    // Test claim instruction
    let claim = await program.methods
      .claim()
      .accounts({
        globalState: pdaGlobalAccount,
        stream: pdaStakeAccount,
        escrowAccount: pdaEscrow,
        recipient: recipientATA.address,
        authority: vault.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([vault])
      .rpc();

    await confirmTransaction(claim);
  };

  const cancel = async (vault) => {
    // Get stake PDA
    const [pdaStakeAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("lock"), vault.publicKey.toBytes()],
      program.programId
    );

    let vaultATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      mintAccount,
      vault.publicKey
    );

    // Test cancel instruction
    let cancel = await program.methods
      .cancel()
      .accounts({
        globalState: pdaGlobalAccount,
        stream: pdaStakeAccount,
        escrowAccount: pdaEscrow,
        userVault: vaultATA.address,
        authority: vault.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([vault])
      .rpc();

    await confirmTransaction(cancel);
  };

  it("Initialize test accounts", async () => {
    // Airdrop sol to the test users
    let adminSol = await provider.connection.requestAirdrop(
      admin.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await confirmTransaction(adminSol);

    let payerSol = await provider.connection.requestAirdrop(
      payer.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await confirmTransaction(payerSol);

    let vaultSol = await provider.connection.requestAirdrop(
      vault.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await confirmTransaction(vaultSol);

    let user1Sol = await provider.connection.requestAirdrop(
      user1.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await confirmTransaction(user1Sol);

    let user2Sol = await provider.connection.requestAirdrop(
      user2.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await confirmTransaction(user2Sol);

    let mintAuthoritySol = await provider.connection.requestAirdrop(
      mintAuthority.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await confirmTransaction(mintAuthoritySol);

    // Create mint token with decimals
    mintAccount = await createMint(
      provider.connection,
      payer,
      mintAuthority.publicKey,
      null,
      DECIMALS
    );
  });

  it("Initialize global account", async () => {
    [pdaGlobalAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("global")],
      program.programId
    );
    [pdaEscrow] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("escrow")],
      program.programId
    );

    // Test initialize instruction
    let init = await program.methods
      .initialize()
      .accounts({
        globalState: pdaGlobalAccount,
        escrowAccount: pdaEscrow,
        mint: mintAccount,
        authority: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(init);
  });

  it("Test stake", async () => {
    const [pdaStakeAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("lock"), vault.publicKey.toBytes()],
      program.programId
    );

    const now = Date.now() / 1000;
    let streamParams = {
      startTime: new BN(now),
      endTime: new BN(now + 4),
      stakedAmount: new BN(STAKE_AMOUNT),
      cliff: new BN(1),
      cliffRate: PERCENT_50, // 50% tokens transfered during cliff
      releaseFrequency: 1,
      releaseRate: PERCENT_25, // 25% tokens transfered after cliff
      streamName: "Testing",
      authority: vault.publicKey,
      decimals: DECIMALS,
    };

    await stake(streamParams);

    // Check remaining mint tokens after transaction
    let vaultAddress = await getAssociatedTokenAddress(
      mintAccount,
      vault.publicKey
    );
    let tokenAccount = await getAccount(provider.connection, vaultAddress);
    assert.equal(Number(tokenAccount.amount), MINT_AMOUNT - STAKE_AMOUNT);

    // Check minted token transferred to escrow account after transaction
    let stakedAccount = await program.account.streamInstruction.fetch(
      pdaStakeAccount
    );
    let escrowAmount = await provider.connection.getTokenAccountBalance(
      pdaEscrow
    );
    assert.equal(
      escrowAmount.value.amount,
      stakedAccount.initialStakedAmount.toString()
    );
  });

  it("Claim during lockup period", async () => {
    // Test claim user with lockup period
    try {
      await claim(vault, user1);
    } catch (e) {
      let errorMsg = e.error.errorMessage;
      assert.equal(errorMsg, "Error: You need to wait at least lockup period.");
    }
  });

  it("Claim after lockup Period", async () => {
    // Sleep for 2 months so that the lockup period will over
    await sleep(2 * Number(MONTHLY_TIMESTAMP));

    // Expect claim success
    await claim(vault, user1);

    // Check user's token balance
    let vaultAddress = await getAssociatedTokenAddress(
      mintAccount,
      vault.publicKey
    );
    let tokenAccount = await getAccount(provider.connection, vaultAddress);
    assert.equal(MINT_AMOUNT - STAKE_AMOUNT, Number(tokenAccount.amount));

    // Check recipient's token balance
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey
    );
    tokenAccount = await getAccount(provider.connection, user1ATA);
    assert.equal(
      calcShare(STAKE_AMOUNT, PERCENT_50),
      Number(tokenAccount.amount)
    );

    // Claim second time, after 1 month
    await sleep(1 * Number(MONTHLY_TIMESTAMP));

    await claim(vault, user1);

    user1ATA = await getAssociatedTokenAddress(mintAccount, user1.publicKey);
    tokenAccount = await getAccount(provider.connection, user1ATA);
    // Now the user must have 75% of the token share (50% + 25%)
    assert.equal(
      calcShare(STAKE_AMOUNT, PERCENT_75),
      Number(tokenAccount.amount)
    );

    // Claim second time, after 1 month
    await sleep(1 * Number(MONTHLY_TIMESTAMP));

    await claim(vault, user1);

    user1ATA = await getAssociatedTokenAddress(mintAccount, user1.publicKey);
    tokenAccount = await getAccount(provider.connection, user1ATA);
    // Now the user must have 100% of the token share (50% + 25% + 25%)
    assert.equal(
      calcShare(STAKE_AMOUNT, PERCENT_100),
      Number(tokenAccount.amount)
    );
  });

  it("Cancel Vesting Schedule by acounts other than vault account", async () => {
    // Cancel Vesting Schedule by admin account
    try {
      await cancel(admin);
    } catch (e) {
      let errorCode = e.error.errorCode.code;
      assert.equal(errorCode, "AccountNotInitialized");
    }

    // Cancel Vesting Schedule by payer account
    try {
      await cancel(payer);
    } catch (e) {
      let errorCode = e.error.errorCode.code;
      assert.equal(errorCode, "AccountNotInitialized");
    }
  });

  it("Cancel Vesting Schedule", async () => {
    // Cancel Vesting Schedule
    await cancel(vault);

    // Check vault's token balance
    let vaultATA = await getAssociatedTokenAddress(
      mintAccount,
      vault.publicKey
    );
    let tokenAccount = await getAccount(provider.connection, vaultATA);
    assert.equal(MINT_AMOUNT - STAKE_AMOUNT, Number(tokenAccount.amount));
  });

  it("Claim after cancellation of Vesting Contract", async () => {
    try {
      await claim(vault, user1);
    } catch (e) {
      let errorMsg = e.error.errorMessage;
      assert.equal(errorMsg, "Error: Your balance is not enough.");
    }
  });
});

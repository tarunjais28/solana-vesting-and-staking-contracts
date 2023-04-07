# Staking Contract

## Steps:

1. Initialise staking contract
2. Stake tokens
3. Unstake tokens


## Function `initialize()`

This function is use to initialize the Staking Contract

### Accounts

```
    global_state: <PDA for store global state>
    escrow_account: <PDA for storing tokens>
    authority: <Admin's account>
    mint: <Mint Address of the spl-token>
    system_program: <Solana System program account>
    token_program: <Solana Token program account>
    rent: <Solana Rent key account>
```


## Function `stake()`

This function is use to stake the bt-tokens to the state of the contract.

### Formula

The formula for staking rewards is:-
        
![\Large staking\hspace{2mm}rewards = \frac{number\hspace{2mm}of\hspace{2mm}token\hspace{2mm}staked\hspace{2mm}by\hspace{2mm}the \hspace{2mm}user}{total\hspace{2mm}number\hspace{2mm}of\hspace{2mm}staked\hspace{2mm} tokens}\times{number\hspace{2mm}of\hspace{2mm}days\hspace{2mm}tokens\hspace{2mm}are\hspace{2mm}staked\hspace{2mm}by\hspace{2mm}the\hspace{2mm}user}](../../images/staking_equation.svg) 



#### Parameters as JSON

```
{
    "staked_amount": "<amount to be staked in 64 bit unsigned integer>"
}
```

#### Accounts

```
    global_state: <PDA for storing global state>
    stake_state: <PDA for storing stake state>
    escrow_account: <PDA for storing tokens>
    user_vault: <User's account>
    vault_authority: <User's account as Signer>
    system_program: <Solana System program account>
    token_program: <Solana Token program account>
    rent: <Solana Rent key account>
```

##### Errors

Possible errors can be:-
    - Insufficient Funds (when User vault has lesser value than staked value passed by the user)


## Function `unstake()`

This function is use to unstake the staked bt-tokens and transfer to the owner's wallet with rewards.

### Parameters as JSON

```
{
    "withdrawal_amount": "<amount to be withdrawal in 64 bit unsigned integer>"
}
```

### Accounts

```
    global_state: <PDA for storing global state>
    stake_state: <PDA for storing stake state>
    escrow_account: <PDA for storing tokens>
    user_vault: <User's account>
    reward_account: <Account that holds rewards>
    vault_authority: <Vault's account as Signer>
    reward_authority: <Rewards' account as Signer>
    system_program: <Solana System program account>
    token_program: <Solana Token program account>
    rent: <Solana Rent key account>
```

#### Errors

Possible errors can be:-
    - Insufficient Funds (when withdrawal amount has greater value than staked value)

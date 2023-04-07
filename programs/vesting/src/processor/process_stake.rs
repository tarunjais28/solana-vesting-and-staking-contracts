use super::*;

/// Function to lock the tokens for specific period of time with other
/// scheduling details.
///
/// This function can produce the following error:-
///  -  `InsufficientFunds` when the user vault doesn't contain the requested
///     staked amount.
pub fn process_stake(ctx: Context<Stake>, stream_params: StreamParams) -> Result<()> {
    // Check user balance first
    require!(
        ctx.accounts.user_vault.amount >= stream_params.staked_amount,
        CustomError::InsufficientFunds
    );

    // Transfer tokens from user to vault's account
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_vault.to_account_info(),
        to: ctx.accounts.escrow_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    token::transfer(
        CpiContext::new(cpi_program, cpi_accounts),
        stream_params.staked_amount,
    )?;

    // Store stake information
    let stream = &mut ctx.accounts.stream;
    stream.store(stream_params)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct Stake<'info> {
    #[account(
        seeds = [GLOBAL_STATE_TAG],
        bump,
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    #[account(
        init,
        seeds = [LOCK_STATE_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = std::mem::size_of::<StreamInstruction>() + 8
    )]
    pub stream: Box<Account<'info, StreamInstruction>>,

    #[account(
        mut,
        seeds = [ESCROW_TAG],
        bump,
    )]
    pub escrow_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = authority.key() == user_vault.owner,
        constraint = user_vault.mint == global_state.mint
    )]
    pub user_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

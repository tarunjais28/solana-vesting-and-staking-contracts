use super::*;

/// Function to cancel vesting schedule at any time by the user who locked the
/// tokens.
///
/// Throws `AccountNotInitialized` error when called by any account other than
/// user who locked the tokens.
pub fn process_cancel(ctx: Context<Cancel>) -> Result<()> {
    let stream = &mut ctx.accounts.stream;

    // Find bump for vault PDA
    let (_, bump) = Pubkey::find_program_address(&[ESCROW_TAG], &crate::ID);

    // Transfer reward amount from vault to user's account
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_account.to_account_info(),
        to: ctx.accounts.user_vault.to_account_info(),
        authority: ctx.accounts.escrow_account.to_account_info(),
    };
    token::transfer(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, &[&[ESCROW_TAG, &[bump]]]),
        stream.remaining_amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct Cancel<'info> {
    #[account(
        seeds = [GLOBAL_STATE_TAG],
        bump,
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    #[account(
        mut,
        seeds = [LOCK_STATE_TAG, authority.key().as_ref()],
        bump,
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

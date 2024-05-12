use super::*;

/// Function to unstake the tokens
///
/// This function can throw following errors:
///   - Insufficient Funds (when withdrawal amount has greater value than
///     staked value).
pub fn unstake_amount(ctx: Context<Unstake>, withdrawal_amount: u64) -> Result<()> {
    let stake_state = &mut ctx.accounts.stake_state;
    let global_state = &mut ctx.accounts.global_state;

    // Check unstake status
    require!(
        stake_state.staked_amount >= withdrawal_amount,
        CustomError::InsufficientFunds
    );

    stake_state.calc_rewards(global_state.total_staked_amount);

    let pay = stake_state.calc_pay_amt(withdrawal_amount);

    // Find bump for vault PDA
    let (_, bump) = Pubkey::find_program_address(&[ESCROW_TAG], &crate::ID);

    // Transfer staked amount from vault to user's account
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let mut cpi_accounts = Transfer {
        from: ctx.accounts.escrow_account.to_account_info(),
        to: ctx.accounts.user_vault.to_account_info(),
        authority: ctx.accounts.escrow_account.to_account_info(),
    };
    token::transfer(
        CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, &[&[ESCROW_TAG, &[bump]]]),
        pay.amount,
    )?;

    // Transfer reward amount from reward vault to user's account
    cpi_accounts = Transfer {
        from: ctx.accounts.reward_account.to_account_info(),
        to: ctx.accounts.user_vault.to_account_info(),
        authority: ctx.accounts.reward_authority.to_account_info(),
    };
    token::transfer(CpiContext::new(cpi_program, cpi_accounts), pay.rewards)?;

    // Updating total_staked_amount
    global_state.total_staked_amount -= withdrawal_amount;

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct Unstake<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_STATE_TAG],
        bump,
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    #[account(
        mut,
        seeds = [LOCK_STATE_TAG, vault_authority.key().as_ref()],
        bump,
    )]
    pub stake_state: Box<Account<'info, StakeState>>,

    #[account(
        mut,
        seeds = [ESCROW_TAG],
        bump,
    )]
    pub escrow_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = vault_authority.key() == user_vault.owner,
        constraint = user_vault.mint == global_state.mint
    )]
    pub user_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = reward_authority.key() == reward_account.owner,
        constraint = reward_account.mint == global_state.mint
    )]
    pub reward_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub vault_authority: Signer<'info>,

    #[account(mut)]
    pub reward_authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

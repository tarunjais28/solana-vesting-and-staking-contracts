use crate::{constants::*, errors::*, instructions::*, states::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

mod constants;
mod errors;
mod instructions;
mod states;

declare_id!("2sbJrDbu2ansQ6NZ78GrBb3NYGaGcKpF5WJQCo581uvD");

#[program]
pub mod staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn stake(ctx: Context<Stake>, staked_amount: u64) -> Result<()> {
        instructions::stake(ctx, staked_amount)
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        instructions::unstake(ctx, amount)
    }
}

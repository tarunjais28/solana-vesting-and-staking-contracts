#![allow(unexpected_cfgs)]
use crate::{constants::*, errors::*, instructions::*, states::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

mod constants;
mod errors;
mod instructions;
mod states;

declare_id!("9WdiiK983NAUBarCxC4xzZqVJn6LHPea8hXy9J5cSbmj");

#[program]
pub mod staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::init(ctx)
    }

    pub fn stake(ctx: Context<Stake>, staked_amount: u64) -> Result<()> {
        instructions::stake_amount(ctx, staked_amount)
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        instructions::unstake_amount(ctx, amount)
    }
}

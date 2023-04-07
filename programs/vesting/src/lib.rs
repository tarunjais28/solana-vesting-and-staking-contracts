use crate::{constants::*, errors::*, processor::*, states::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

mod constants;
mod errors;
mod processor;
mod states;

declare_id!("ByFJEZWdpswG6LiGTCPRJnyAFeUpXcYRe24tzuNPwkMY");

#[program]
pub mod vesting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        process_initialize(ctx)
    }

    pub fn stake(ctx: Context<Stake>, stream_params: StreamParams) -> Result<()> {
        process_stake(ctx, stream_params)
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        process_claim(ctx)
    }

    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        process_cancel(ctx)
    }
}

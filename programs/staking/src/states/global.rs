use super::*;

#[account]
#[derive(Default)]
pub struct GlobalState {
    pub mint: Pubkey,
    pub total_staked_amount: u64,
}

impl GlobalState {
    pub fn save(&mut self, mint: Pubkey) {
        self.mint = mint;
    }
}

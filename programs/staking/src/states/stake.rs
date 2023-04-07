use super::*;

/// The struct containing instructions for staking
#[account]
#[derive(Default)]
pub struct StakeState {
    /// Initial staked amount
    pub staked_amount: u64,
    /// Timestamp when token is going to staked
    pub staked_at: i64,
    /// Rewards earned
    pub rewards: u64,
}

impl StakeState {
    // Function to stake data
    pub fn stake(&mut self, staked_amount: u64) -> Result<()> {
        self.staked_amount += staked_amount;
        self.staked_at = Clock::get()
            .expect("Error while getting staked duration.")
            .unix_timestamp;

        Ok(())
    }

    // Function to calculate rewards
    pub fn calc_rewards(&mut self, total_staked: u64) {
        let now = Clock::get()
            .expect("Error while getting current timestamp.")
            .unix_timestamp;

        let num_of_days = (now - self.staked_at) as f64 / SECONDS_PER_DAY as f64;

        self.rewards += ((self.staked_amount as f64) / total_staked as f64 * num_of_days) as u64;
    }

    // Function to calculate payable amount
    pub fn calc_pay_amt(&mut self, withdrawal_amount: u64) -> Payable {
        let proportion = withdrawal_amount as f64 / self.staked_amount as f64;

        let mut pay = Payable {
            amount: self.staked_amount,
            rewards: self.rewards,
        };
        pay.proportionated(proportion);

        self.settled(&pay);

        pay
    }

    // Settlement of rewards and staked amount
    fn settled(&mut self, pay: &Payable) {
        self.staked_amount -= pay.amount;
        self.rewards -= pay.rewards;
    }
}

pub struct Payable {
    pub amount: u64,
    pub rewards: u64,
}

impl Payable {
    fn proportionated(&mut self, val: f64) {
        self.amount = (self.amount as f64 * val) as u64;
        self.rewards = (self.rewards as f64 * val) as u64;
    }
}

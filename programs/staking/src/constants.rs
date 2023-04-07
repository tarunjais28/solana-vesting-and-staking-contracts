use super::*;

#[constant]
pub const SECONDS_PER_DAY: u64 = 60 * 60 * 24;

#[constant]
pub const GLOBAL_STATE_TAG: &[u8] = b"global";

#[constant]
pub const ESCROW_TAG: &[u8] = b"escrow";

#[constant]
pub const LOCK_STATE_TAG: &[u8] = b"lock";

use super::*;

#[constant]
pub const MONTHLY_TIMESTAMP: i64 = 60 * 60 * 24 * 30; // Assume 30 days per month

#[constant]
pub const GLOBAL_STATE_TAG: &[u8] = b"global";

#[constant]
pub const ESCROW_TAG: &[u8] = b"escrow";

#[constant]
pub const LOCK_STATE_TAG: &[u8] = b"lock";

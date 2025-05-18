/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vesting.json`.
 */
export type Vesting = {
  "address": "4gvGr6xShLwiL1whWTtJWraAxL82fPAka1fqCrxEujhT",
  "metadata": {
    "name": "vesting",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "cancel",
      "discriminator": [
        232,
        219,
        223,
        41,
        219,
        236,
        220,
        190
      ],
      "accounts": [
        {
          "name": "globalState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "stream",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  107
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              }
            ]
          }
        },
        {
          "name": "userVault",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "claim",
      "discriminator": [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      "accounts": [
        {
          "name": "globalState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "stream",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  107
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              }
            ]
          }
        },
        {
          "name": "recipient",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "stake",
      "discriminator": [
        206,
        176,
        202,
        18,
        200,
        209,
        179,
        108
      ],
      "accounts": [
        {
          "name": "globalState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "stream",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  107
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              }
            ]
          }
        },
        {
          "name": "userVault",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "streamParams",
          "type": {
            "defined": {
              "name": "streamParams"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "discriminator": [
        163,
        46,
        74,
        168,
        216,
        123,
        133,
        98
      ]
    },
    {
      "name": "streamInstruction",
      "discriminator": [
        127,
        170,
        134,
        151,
        91,
        205,
        131,
        93
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "tokensStillLocked",
      "msg": "Error: You need to wait at least lockup period."
    },
    {
      "code": 6001,
      "name": "insufficientFunds",
      "msg": "Error: Your balance is not enough."
    }
  ],
  "types": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "streamInstruction",
      "docs": [
        "The struct containing instructions for initializing a stream"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "docs": [
              "Timestamp when the tokens start vesting"
            ],
            "type": "i64"
          },
          {
            "name": "endTime",
            "docs": [
              "Timestamp when all tokens are fully vested"
            ],
            "type": "i64"
          },
          {
            "name": "initialStakedAmount",
            "docs": [
              "Initial staked amount"
            ],
            "type": "u64"
          },
          {
            "name": "remainingAmount",
            "docs": [
              "Staked amount left"
            ],
            "type": "u64"
          },
          {
            "name": "cliff",
            "docs": [
              "Vesting contract \"cliff\" months"
            ],
            "type": "u32"
          },
          {
            "name": "cliffRate",
            "docs": [
              "Amount unlocked at the \"cliff\" timestamp"
            ],
            "type": "u64"
          },
          {
            "name": "releaseFrequency",
            "docs": [
              "Release frequency of recurring payment in months"
            ],
            "type": "u32"
          },
          {
            "name": "releaseRate",
            "docs": [
              "Release rate of recurring payment"
            ],
            "type": "u64"
          },
          {
            "name": "streamName",
            "docs": [
              "The name of this stream"
            ],
            "type": "string"
          },
          {
            "name": "lastClaimedAt",
            "docs": [
              "Timestamp when the tokens were last claimed"
            ],
            "type": "i64"
          },
          {
            "name": "nextPayAt",
            "docs": [
              "Timestamp when the tokens will be paid next"
            ],
            "type": "i64"
          },
          {
            "name": "nextPayAmount",
            "docs": [
              "Amount of tokens to be payed next"
            ],
            "type": "u64"
          },
          {
            "name": "decimals",
            "docs": [
              "Decimals supported by the token"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "streamParams",
      "docs": [
        "The struct containing instructions for initializing a stream"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "docs": [
              "Timestamp when the tokens start vesting"
            ],
            "type": "i64"
          },
          {
            "name": "endTime",
            "docs": [
              "Timestamp when all tokens are fully vested"
            ],
            "type": "i64"
          },
          {
            "name": "stakedAmount",
            "docs": [
              "Staked amount"
            ],
            "type": "u64"
          },
          {
            "name": "cliff",
            "docs": [
              "Vesting contract \"cliff\" months"
            ],
            "type": "u32"
          },
          {
            "name": "cliffRate",
            "docs": [
              "Amount unlocked at the \"cliff\" timestamp"
            ],
            "type": "u64"
          },
          {
            "name": "releaseFrequency",
            "docs": [
              "Release frequency of recurring payment in months"
            ],
            "type": "u32"
          },
          {
            "name": "releaseRate",
            "docs": [
              "Release rate of recurring payment"
            ],
            "type": "u64"
          },
          {
            "name": "streamName",
            "docs": [
              "The name of this stream"
            ],
            "type": "string"
          },
          {
            "name": "decimals",
            "docs": [
              "Decimals supported by the token"
            ],
            "type": "u32"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "escrowTag",
      "type": "bytes",
      "value": "[101, 115, 99, 114, 111, 119]"
    },
    {
      "name": "globalStateTag",
      "type": "bytes",
      "value": "[103, 108, 111, 98, 97, 108]"
    },
    {
      "name": "lockStateTag",
      "type": "bytes",
      "value": "[108, 111, 99, 107]"
    },
    {
      "name": "monthlyTimestamp",
      "type": "i64",
      "value": "2592000"
    }
  ]
};

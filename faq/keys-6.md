---
title: When does a validator become active?
---

After key submission, and if keys have been successfully validated, two actions are required for a validator to be activated:

1. **Deposit by Lido Protocol**: The time to deposit a validator is unpredictable and depends on factors such as total stake inflows and outflows, gas considerations, module shares, CSM deposit queue size, and the Node Operator's place in the queue.
   1. Initially, new stake enters the Lido protocol and is held in a buffer to accommodate any potential withdrawal requests. If the net flow of stake (inflows minus outflows) is positive, the stake is then distributed among various modules according to the Staking Router algorithm, including CSM.
   2. Stake is allocated to modules taking into account the stake share limits for each module. To determine the destination module for the stake, all modules are arranged by the number of active validators. If the module with the fewest active validators has available capacity (i.e., it has depositable keys), stake is deposited there up to the limit of depositable keys or the stake share, whichever comes first. If there remaining deposits to be allocated, the next module in line has its turn, etc.
   3. Upon reaching CSM, the next validator to be deposited is determined by [the stake allocation queue](https://operatorportal.lido.fi/modules/community-staking-module#block-4979446857e44503942bd80678465607), which operates on a First-In, First-Out (FIFO) basis.
2. **Activation on Ethereum Network**: Once deposited, the validator enters the Beacon Chain activation queue. The time to activation depends on the total number of validators in the queue awaiting activation and the rate of queue processing, which varies based on the total number of active Ethereum validators.

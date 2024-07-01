---
title: 'When does a validator become active?'
---

After key submission, two actions are required for a validator to become active:

1. **Deposit by Lido Protocol**: The time to deposit a validator is unpredictable and depends on factors such as total stake inflows and outflows, module shares, and CSM deposit queue size.
   1. Initially, new stake enters the Lido protocol and is held in a buffer to accommodate any potential withdrawal requests. If the net flow of stake (inflows minus outflows) is positive, the stake is then distributed among various modules, including CSM.
   2. The stake is evenly distributed among all modules, taking into account the stake share limits for each module. To determine the initial destination module for the stake, all modules are arranged by the number of active validators. If the module with the fewest active validators has available capacity (i.e., it has submitted keys ready for deposit), the stake is deposited there. Otherwise, it moves to the next module in line.
   3. Upon reaching CSM, the next validator to be deposited is determined by [the stake allocation queue](https://hackmd.io/@lido/rJMcGj0Ap#Stake-allocation-queue), which operates on a first-in, first-out (FIFO) basis.
2. **Activation on Ethereum Network**: Once deposited, the validator enters an activation queue. The time to activation depends on the total number of validators in the queue awaiting activation.

---
title: When does a validator become withdrawn?
anchor: when-validator-become-withdrawn
---

On the Ethereum network, a validator can be withdrawn after successfully exiting from the consensus layer, but the exact timing of withdrawal depends on several factors related to Ethereum protocol mechanics:

1. **Exit Queue**: When a validator initiates an exit, it enters an exit queue. The time required to exit depends on the number of validators exiting and the churn limit (the number of validators allowed to exit or enter per epoch).
2. **Withdrawal Process**: After exiting the active validator set, the validator enters a withdrawable state. This state is determined by the withdrawable epoch, which is set to the exit epoch + a minimum delay of 256 epochs (~27 hours).
3. **Finalization of Withdrawal**: Once the withdrawable epoch is reached, the validator balance will be transferred to the validator's withdrawal credentials (in the case of the Lido protocol, the Lido Withdrawal Vault) within the next iteration of the Consensus Layer withdrawal sweep cycle. How long this takes depends on the validator's position in the overall sweep cycle, and time difference between the withdrawable epoch and when its turn will come to be swept. Once the withdrawal has occurred, the fact of the withdrawal can be reported to CSM permissionlessly. Once that occurs, the part of the Node Operator’s bond used for this validator is released. At this point, the Node Operator can claim the bond on the Bond & Rewards Claim tab.

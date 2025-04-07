---
title: How does the CSM Performance Oracle work?
---

The Performance Oracle uses the successful attestation rate `successfulAttestations / totalAssignedAttestations` (where `successfulAttestation` stands for the attestation that has been included in the beacon block no matter the inclusion distance) as a proxy for the overall performance of a validator. The Performance Oracle compares the performance of each validator with the performance threshold to determine whether the validator should or should not be included in the rewards distribution during the frame.

The frame for the Performance Oracle report is set to 7 days. The Performance Oracle creates a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) with the allocation of the Node Operator rewards and delivers the root on-chain. To make the original tree available to users, it is published on [IPFS](https://ipfs.tech/) and [GitHub](https://github.com/lidofinance/csm-rewards).

---
title: When does a validator become active?
anchor: when-validator-become-active
---

After key submission, and if keys have been successfully validated, two actions are required for a validator to be activated:

1. **Deposit by Lido Protocol**: The time to deposit a validator is unpredictable and depends on factors such as total stake inflows and outflows, gas considerations, module shares, CSM deposit queue size, and the Node Operator's place in the queue.

   You can subscribe to [the important CSM events](https://docs.lido.fi/staking-modules/csm/guides/events) to stay notified about your validator being deposited to.

   Read more information about the deposits flow [here](https://operatorportal.lido.fi/modules/community-staking-module#block-90b8ff95edc64cf7a051584820219616).

2. **Activation on Ethereum Network**: Once deposited, the validator enters the Beacon Chain activation queue. The time to activation depends on the total number of validators in the queue awaiting activation and the rate of queue processing, which varies based on the total number of active Ethereum validators.

   You can check if the keys are activated on the [Keys tab](https://csm.testnet.fi/keys) or on [beaconcha.in](http://beaconcha.in/)

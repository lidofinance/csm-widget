---
title: How to set up a validator for CSM mainnet?
---

A detailed guide on preparing all the validation tools for CSM can be found [here](https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm).

A shorter flow of setting up a CSM validator for mainnet looks as follows:

1. [Generate new validator keys](https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/validator-key-generation) setting the `withdrawal_address` to the Lido Withdrawal Vault on **mainnet:** [`0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f`](https://etherscan.io/address/0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f) and specify the deposit amount of 32 ETH (do **NOT** make a deposit)
2. [Configure your validator client](https://dvt-homestaker.stakesaurus.com/native-solo-staking-setup/validator-client-setup) (and/or beacon node) setting the `fee_recipient` flag to the designated fee recipient address (Lido Execution Layer Rewards Vault) on **mainnet:** [`0x388C818CA8B9251b393131C08a736A67ccB19297`](https://etherscan.io/address/0x388C818CA8B9251b393131C08a736A67ccB19297) and import the newly generated CSM keystores
3. [Configure your MEV-Boost service](https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/set-up-and-configure-mev-boost). `Min-bid` may be configured either at MEV-Boost level or at the CL client, the current acceptable maximum value for min-bid is `0.07` [based on community consensus](https://research.lido.fi/t/lido-node-operator-mev-boost-min-bid-guidance/3347) and may change. `Builder-boost-factor` should be set to 100%, i.e. local and builder payloads should be treated with equal weights. The `relay` flags should be set to a list of values only using relays from [the list of Vetted MEV-Boost Relays for Lido CSM](https://enchanted-direction-844.notion.site/6d369eb33f664487800b0dedfe32171e?v=8e5d1f1276b0493caea8a2aa1517ed65).
4. [Upload the newly generated deposit data](https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/upload-remove-view-validator-keys) file pertaining to your CSM keystores onto [the Lido CSM Widget](https://csm.lido.fi/) and provide the required bond amount in ETH/stETH/wstETH. Before uploading, make sure that nodes are synced, running, and ready for the validator activation.
5. Wait for your CSM validator keys to be deposited through the protocol and make sure your node remains online in the meantime!

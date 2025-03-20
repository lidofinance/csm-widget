---
title: How to set up a validator for CSM testnet?
---

A detailed guide on preparing all the validation tools for CSM can be found [here](https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm).

A shorter flow of setting up a CSM validator for **testnet** looks as follows:

1. [Generate new validator keys](https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/validator-key-generation) setting the `withdrawal_address` to the [Lido Withdrawal Vault](https://hoodi.cloud.blockscout.com/address/0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2) on **Hoodi:** [`0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2`](https://hoodi.cloud.blockscout.com/address/0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2) and specify the deposit amount of 32 ETH (do **NOT** make a deposit)
2. [Configure your validator client](https://dvt-homestaker.stakesaurus.com/native-solo-staking-setup/validator-client-setup) (and/or beacon node) setting the `fee_recipient` flag to the designated fee recipient address (Lido Execution Layer Rewards Vault) on **Hoodi:** [`0x9b108015fe433F173696Af3Aa0CF7CDb3E104258`](https://hoodi.cloud.blockscout.com/address/0x9b108015fe433F173696Af3Aa0CF7CDb3E104258) and import the newly generated CSM keystores
3. **Do not setup any MEV-Boost**
4. [Upload the newly generated deposit data](https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/upload-remove-view-validator-keys) file pertaining to your CSM keystores onto [the Lido CSM Widget](https://csm.testnet.fi/) and provide the required bond amount in Hoodi ETH/stETH/wstETH. Before uploading, make sure that nodes are synced, running, and ready for the validator activation.
5. Wait for your CSM validator keys to be deposited through the protocol and make sure your node remains online in the meantime!

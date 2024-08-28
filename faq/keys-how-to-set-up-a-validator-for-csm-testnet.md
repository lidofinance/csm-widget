---
title: 'How to set up a validator for CSM testnet?'
---

A detailed guide on preparing all the validation tools for CSM can be found [here](https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm).

A shorter flow of setting up a CSM validator for **testnet** looks as follows:

1. [Generate new validator keys](https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/validator-key-generation) setting the `withdrawal_address` to the [Lido Withdrawal Vault](https://holesky.etherscan.io/address/0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9) on **Holesky:** [`0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9`](https://holesky.etherscan.io/address/0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9) and specify the deposit amount of 32 ETH (do **NOT** make a deposit)
2. [Configure your validator client](https://dvt-homestaker.stakesaurus.com/native-solo-staking-setup/validator-client-setup) (and/or beacon node) setting the `fee_recipient` flag to the designated fee recipient address (Lido Execution Layer Rewards Vault) on **Holesky:** [`0xE73a3602b99f1f913e72F8bdcBC235e206794Ac8`](https://holesky.etherscan.io/address/0xE73a3602b99f1f913e72F8bdcBC235e206794Ac8) and import the newly generated CSM keystores
3. [Configure your MEV-Boost service](https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/set-up-and-configure-mev-boost). Do not set the `min-bid` flag (or set 0) and set the `relay` flags only to [the list of designated MEV relays for Lido CSM on **Holesky**](https://www.notion.so/6d369eb33f664487800b0dedfe32171e?pvs=21)
4. [Upload the newly generated deposit data](https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/upload-remove-view-validator-keys) file pertaining to your CSM keystores onto [the Lido CSM Widget](https://csm.testnet.fi/) and provide the required bond amount in Holesky ETH/stETH/wstETH. Before uploading, make sure that nodes are synced, running, and ready for the validator activation.
5. Wait for your CSM validator keys to be deposited through the protocol and make sure your node remains online in the meantime!

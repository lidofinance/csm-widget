---
title: 'How to set up a validator for CSM testnet?'
---

In short, the flow of setting up a CSM validator for **testnet** looks as follows:

1. [Generate new validator keys](https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/validator-key-generation) while setting the `withdrawal_address` to the Lido CSM contract on **Holesky:** [`0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9`](https://holesky.etherscan.io/address/0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9)
2. [Configure your validator client](https://dvt-homestaker.stakesaurus.com/native-solo-staking-setup/validator-client-setup) while setting the `fee_recipient` flag to the designated fee recipient address for Lido CSM on **Holesky:** [`0xE73a3602b99f1f913e72F8bdcBC235e206794Ac8`](https://holesky.etherscan.io/address/0xE73a3602b99f1f913e72F8bdcBC235e206794Ac8) and import the newly generated CSM keystores
3. [Configure your MEV-Boost service](https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/set-up-and-configure-mev-boost). Do not set the`min-bid` flag and set the `relay` flags only to the list of designated MEV relays for Lido CSM on **Holesky** (refer to previous section)
4. [Upload the newly generated deposit data](https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/upload-remove-view-validator-keys) file pertaining to your CSM keystores onto the Lido CSM Web App and provide the required bond amount in ETH/stETH/wstETH
5. Wait for your CSM validator keys to be funded by Lido and make sure your node remains online in the meantime!

The detailed guide on preparing all the validation tools for CSM can be found [here](https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm).

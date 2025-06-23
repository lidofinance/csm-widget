import React from 'react';
import { Faq } from 'types';
import {
  FaqChainName,
  FaqLidoRewardsVault,
  FaqLink,
  FaqOnlyMainnet,
  FaqOnlyTestnet,
  FaqWithdrawalVault,
} from 'shared/components';

// FIXME: link to ".lido.fi"
export const Keys1: Faq = {
  title: (
    <>
      How to set up a validator for CSM <FaqChainName />?
    </>
  ),
  anchor: 'how-to-set-up-a-validator',
  content: (
    <div>
      <p>
        A detailed guide on preparing all the validation tools for CSM can be
        found{' '}
        <FaqLink href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm">
          here
        </FaqLink>
        .
      </p>
      <p>
        A shorter flow of setting up a CSM validator for <FaqChainName /> looks
        as follows:{' '}
      </p>
      <ol>
        <li>
          <FaqLink href="https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/validator-key-generation">
            Generate new validator keys
          </FaqLink>{' '}
          setting the <code>withdrawal_address</code> to the Lido Withdrawal
          Vault on{' '}
          <strong>
            <FaqChainName />:
          </strong>{' '}
          <FaqWithdrawalVault />, specify the deposit amount of 32 ETH, and set
          WC type to <code>0x01</code> (do <strong>NOT</strong> make a deposit)
        </li>
        <li>
          <FaqLink href="https://dvt-homestaker.stakesaurus.com/native-solo-staking-setup/validator-client-setup">
            Configure your validator client
          </FaqLink>{' '}
          (and/or beacon node) setting the <code>fee_recipient</code> flag to
          the designated fee recipient address (Lido Execution Layer Rewards
          Vault) on{' '}
          <strong>
            <FaqChainName />:
          </strong>{' '}
          <FaqLidoRewardsVault /> and import the newly generated CSM keystores
        </li>
        <FaqOnlyTestnet>
          <li>
            <FaqLink href="https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/set-up-and-configure-mev-boost">
              Configure your MEV-Boost service
            </FaqLink>
            . Do not set the `min-bid` flag (or set 0) and set the `relay` flags
            only to{' '}
            <FaqLink href="https://www.notion.so/6d369eb33f664487800b0dedfe32171e?pvs=21">
              the list of designated MEV relays for Lido CSM on <FaqChainName />
            </FaqLink>
          </li>
        </FaqOnlyTestnet>
        <FaqOnlyMainnet>
          <li>
            <FaqLink href="https://dvt-homestaker.stakesaurus.com/keystore-generation-and-mev-boost/set-up-and-configure-mev-boost">
              Configure your MEV-Boost service
            </FaqLink>
            . <code>Min-bid</code> may be configured either at MEV-Boost level
            or at the CL client, the current acceptable maximum value for
            min-bid is <code>0.07</code>{' '}
            <FaqLink href="https://research.lido.fi/t/lido-node-operator-mev-boost-min-bid-guidance/3347">
              based on community consensus
            </FaqLink>{' '}
            and may change. <code>Builder-boost-factor</code> should be set to
            100%, i.e. local and builder payloads should be treated with equal
            weights. The <code>relay</code> flags should be set to a list of
            values only using relays from{' '}
            <FaqLink href="https://enchanted-direction-844.notion.site/6d369eb33f664487800b0dedfe32171e?v=8e5d1f1276b0493caea8a2aa1517ed65">
              the list of Vetted MEV-Boost Relays for Lido CSM
            </FaqLink>
            . Note that at least one “must use” relay should be used. Relays not
            mentioned in the list are not allowed for use
          </li>
        </FaqOnlyMainnet>
        <li>
          <FaqLink href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/upload-remove-view-validator-keys">
            Upload the newly generated deposit data
          </FaqLink>{' '}
          file pertaining to your CSM keystores onto{' '}
          <FaqLink href="https://csm.lido.fi/">the Lido CSM Widget</FaqLink> and
          provide the required bond amount in ETH/stETH/wstETH. Before
          uploading, make sure that nodes are synced, running, and corresponding
          keystores are imported. Hence, your setup is ready for the validator
          activation
        </li>
        <li>
          Wait for your CSM validator keys to be deposited through the protocol
          and make sure your node remains online in the meantime!
        </li>
      </ol>
    </div>
  ),
};

import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Keys6: Faq = {
  title: 'When does a validator become active?',
  anchor: 'when-validator-become-active',
  content: (
    <div>
      <p>
        After key submission, and if keys have been successfully validated, two
        actions are required for a validator to be activated:
      </p>
      <ol>
        <li>
          <p>
            <strong>Deposit by Lido Protocol</strong>: The time to deposit a
            validator is unpredictable and depends on factors such as total
            stake inflows and outflows, gas considerations, module shares, CSM
            deposit queue size, and the Node Operator&#39;s place in the queue.
          </p>
          <p>
            You can subscribe to{' '}
            <FaqLink href="https://docs.lido.fi/staking-modules/csm/guides/events">
              the important CSM events
            </FaqLink>{' '}
            to stay notified about your validator being deposited to.
          </p>
          <p>
            Read more information about the deposits flow{' '}
            <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-90b8ff95edc64cf7a051584820219616">
              here
            </FaqLink>
            .
          </p>
        </li>
        <li>
          <p>
            <strong>Activation on Ethereum Network</strong>: Once deposited, the
            validator enters the Beacon Chain activation queue. The time to
            activation depends on the total number of validators in the queue
            awaiting activation and the rate of queue processing, which varies
            based on the total number of active Ethereum validators.
          </p>
          <p>
            You can check if the keys are activated on the{' '}
            <FaqLink href="https://csm.lido.fi/keys">Keys tab</FaqLink> or on{' '}
            <FaqLink href="http://beaconcha.in/">beaconcha.in</FaqLink>
          </p>
        </li>
      </ol>
    </div>
  ),
};

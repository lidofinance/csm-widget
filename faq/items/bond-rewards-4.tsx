import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const BondRewards4: Faq = {
  title: 'Why add a bond?',
  anchor: 'why-add-a-bond',
  content: (
    <div>
      <p>
        Submitting a bond serves as a risk mitigation measure for both the
        Ethereum network and the Lido protocol.
      </p>
      <p>
        There are several major reasons for a CSM Node Operator&apos;s bond to
        be penalized, including:
      </p>
      <ul>
        <li>
          <strong>The operator has stolen EL rewards (MEV)</strong>.{' '}
          <code>Penalty amount = amount stolen + fixed stealing fine</code>;
        </li>
        <li>
          <strong>
            The validator&apos;s withdrawal balance is less than 32 ETH
          </strong>
          .{' '}
          <code>Penalty amount = 32 - validator&apos;s withdrawal balance</code>
          ;
        </li>
        <li>
          <strong>The operator has not exited the validators in time.</strong>{' '}
          Penalty amount = <code>exitDelayPenalty</code> (a fixed amount set by
          the DAO);
        </li>
        <li>
          <strong>
            The validator has been ejected via{' '}
            <FaqLink href="https://eips.ethereum.org/EIPS/eip-7002">
              EIP-7002
            </FaqLink>{' '}
            due to an excessive number of strikes.
          </strong>{' '}
          Penalty amount = <code>badPerformancePenalty</code> (a fixed amount
          set by the DAO);
        </li>
        <li>
          <strong>
            Force ejection via{' '}
            <FaqLink href="https://eips.ethereum.org/EIPS/eip-7002">
              EIP-7002
            </FaqLink>{' '}
            was triggered for the validator.
          </strong>{' '}
          Penalty amount ={' '}
          <code>min(actual TW fee paid, maxWithdrawalRequestFee)</code>.
        </li>
      </ul>
    </div>
  ),
};

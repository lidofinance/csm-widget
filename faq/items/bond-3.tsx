import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Bond3: Faq = {
  title: "Why didn't I get rewards?",
  anchor: 'why-did-not-i-get-rewards',
  content: (
    <div>
      <p>There are two main reasons of you getting no reward within a frame:</p>
      <ol>
        <li>
          If your validator&#39;s performance was below the threshold within the
          CSM Performance Oracle frame (28 days for mainnet) the validator does
          not receive rewards for the given frame. Read more about{' '}
          <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-c6dc8d00f13243fcb17de3fa07ecc52c">
            the CSM Performance Oracle
          </FaqLink>
          .
        </li>
      </ol>
    </div>
  ),
};

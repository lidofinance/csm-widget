import React from 'react';
import { Faq } from 'types';
import { FaqFrameDuration, FaqLink } from 'shared/components';

export const BondRewards3: Faq = {
  title: 'Why didn’t I get rewards?',
  anchor: 'why-didnt-i-get-rewards',
  content: (
    <div>
      <p>
        If your validator&apos;s performance was below the threshold within the
        CSM Performance Oracle frame (<FaqFrameDuration /> for mainnet) the
        validator does not receive rewards for the given frame. Read more about{' '}
        <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-c6dc8d00f13243fcb17de3fa07ecc52c">
          the CSM Performance Oracle
        </FaqLink>
        .
      </p>
    </div>
  ),
};

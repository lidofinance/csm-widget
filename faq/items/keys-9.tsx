import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Keys9: Faq = {
  title: 'How to stop validating in CSM?',
  anchor: 'how-to-stop-validating-in-csm',
  content: (
    <div>
      <p>
        Exiting CSM validator keys works the same way as exiting solo staking
        validator keys. The guide on how to exit the validator can be found{' '}
        <FaqLink href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/exiting-csm-validators#manual-exit">
          here
        </FaqLink>
        .
      </p>
    </div>
  ),
};

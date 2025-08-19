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
        <FaqLink href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores">
          here
        </FaqLink>
        .
      </p>
    </div>
  ),
};

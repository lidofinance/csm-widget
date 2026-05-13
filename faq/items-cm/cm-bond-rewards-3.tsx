import React from 'react';
import { Faq } from 'types';

export const CmBondRewards3: Faq = {
  title: 'Why did I not get rewards?',
  anchor: 'why-didnt-i-get-rewards',
  content: (
    <div>
      <p>
        Common reasons for not getting rewards or getting less than expected:
      </p>
      <ul>
        <li>The Oracle report is delayed.</li>
        <li>
          Your keys are still waiting for deposits and have not been activated
          yet.
        </li>
        <li>
          Your bond is below the required minimum, leaving some keys unbonded.
        </li>
        <li>You have locked bond that has not been compensated.</li>
      </ul>
    </div>
  ),
};

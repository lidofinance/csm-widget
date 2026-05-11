import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmLockedBond3: Faq = {
  title: 'Consequences of not compensating?',
  anchor: 'consequences-of-not-compensating',
  content: (
    <div>
      <p>
        If you do not compensate the locked bond within the 60-day window, an
        EasyTrack motion is submitted to confirm the penalty. If enacted, the
        locked funds are permanently burned to cover losses for stETH holders.
      </p>
      <p>
        While waiting, any bond shortfall leaves your keys unbonded and freezes
        new stake allocations.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/penalties">
          See Penalties
        </FaqLink>
      </p>
    </div>
  ),
};

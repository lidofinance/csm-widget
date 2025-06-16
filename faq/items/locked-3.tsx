import React from 'react';
import { Faq } from 'types';

export const Locked3: Faq = {
  title: 'Consequences of not compensating?',
  anchor: 'consequences-of-not-compensating',
  content: (
    <div>
      <p>
        In case of refusal to compensate the penalty, a protocol rule violation
        occurs which results in the reset of all node operator benefits. The
        locked bond is burned to compensate all stETH holders for the rewards
        stolen.
      </p>
    </div>
  ),
};

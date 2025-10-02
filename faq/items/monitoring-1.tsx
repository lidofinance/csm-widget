import React from 'react';
import { FaqPerformanceLeeway } from 'shared/components/faq/faq-performance-leeway';
import { Faq } from 'types';

export const Monitoring1: Faq = {
  title: 'What is the performance threshold?',
  anchor: 'what-is-the-performance-threshold',
  content: (
    <div>
      <p>
        The performance threshold is a relative variable determined as follows:
      </p>
      <p>
        <code>
          CSM Performance threshold (%) = Average validator performance across
          the whole Ethereum network (%) - <FaqPerformanceLeeway />
        </code>
      </p>
      <p>
        A performance threshold is utilized to determine the allocation of the
        actual Node Operator rewards. Validators with performance above the
        threshold are included in the allocation pool, while the rest are not.{' '}
      </p>
    </div>
  ),
};

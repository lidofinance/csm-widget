import React from 'react';
import { Faq } from 'types';

export const Keys2: Faq = {
  title: 'Why upload a bond?',
  anchor: 'why-upload-a-bond',
  content: (
    <div>
      <p>
        Submitting a bond serves as a risk mitigation measure for both the
        Ethereum network and the Lido protocol.
      </p>
      <p>
        There are several major reasons for a CSM Node Operator&#39;s bond to be
        penalized, including:
      </p>
      <ul>
        <li>
          <strong>The validator has been slashed.</strong> In this case, the
          initial (minimal) slashing penalty is confiscated.{' '}
          <code>Penalty amount</code> ={' '}
          <code>1 ETH (EFFECTIVE_BALANCE / 32)</code>;
        </li>
        <li>
          <strong>The operator has stolen EL rewards (MEV)</strong>.{' '}
          <code>Penalty amount</code> = <code>amount stolen</code> +{' '}
          <code>fixed stealing fine</code>;
        </li>
        <li>
          <strong>
            The validator&#39;s withdrawal balance is less than 32 ETH
          </strong>
          . <code>Penalty amount</code> = <code>32</code> -{' '}
          <code>validator&#39;s withdrawal balance.</code>
        </li>
      </ul>
    </div>
  ),
};

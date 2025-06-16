import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Bond1: Faq = {
  title: 'What rewards do I get in CSM?',
  anchor: 'what-rewards-do-i-get-in-csm',
  content: (
    <div>
      <p>
        When CSM operators use the Lido protocol to run validators, they can
        receive two types of rewards:
      </p>
      <ul>
        <li>
          <strong>Node Operator rewards</strong>: a share of rewards from staker
          locked stake amount, currently calculated pro-rata based on validators
          operated as a share of total protocol validators, with{' '}
          <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-c6dc8d00f13243fcb17de3fa07ecc52c">
            possible reductions for bad performance
          </FaqLink>
          .
        </li>
        <li>
          <strong>Bond rebase</strong>: staking rewards pertaining to the bonded
          tokens (stETH).
        </li>
      </ul>
    </div>
  ),
};

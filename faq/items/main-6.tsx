import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Main6: Faq = {
  title: 'What makes CSM unique?',
  anchor: 'what-makes-csm-unique',
  content: (
    <div>
      <p>
        CSM provides several unique features to attract and benefit community
        stakers:
      </p>
      <ul>
        <li>
          <strong>Rewards Smoothing</strong>: Rewards, including Execution Layer
          (EL) rewards and MEV, are smoothed with other modules to provide more
          stable rewards comparable to operating validators solo.
        </li>
        <li>
          <strong>Low Bond Requirement</strong>: A low bond for node operators
          makes participation more accessible to a broader range of prospective
          operators.
        </li>
        <li>
          <strong>Exclusive Use of ETH (stETH)</strong>: CSM exclusively uses
          ETH ((w)stETH) for bond and rewards, eliminating the need for other
          assets and simplifying the process for node operators. The bond can be
          submitted as ETH, wstETH, or stETH, and both bond and rewards can be
          withdrawn in any of the three forms (withdrawals in the form of ETH
          follow the{' '}
          <FaqLink href="https://help.lido.fi/en/articles/7858323-how-do-i-unstake-my-steth">
            normal Lido on Ethereum unstaking process
          </FaqLink>
          ).
        </li>
        <li>
          <strong>Enhanced User Experience</strong>: Accessible through a
          multitude of options -- from a web UI to integrations with Dappnode,
          Stereum, Eth-Docker, Sedge, Stereum, CoinPillar, etc., CSM offers a
          leading user-friendly experience, with reduced gas fees for on-chain
          operations and simplified transactions for joining and claiming
          rewards.
        </li>
        <li>
          <strong>Higher Reward Potential</strong>: Node operators are
          potentially able to earn more rewards compared to vanilla solo
          staking, making CSM an attractive option for operators looking to run
          more validators to earn rewards.
        </li>
      </ul>
    </div>
  ),
};

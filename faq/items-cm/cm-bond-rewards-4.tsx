import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';
import { getExternalLinks } from 'consts/external-links';

const { stakeWidget } = getExternalLinks();

export const CmBondRewards4: Faq = {
  title: 'How to claim ETH using a withdrawal NFT?',
  anchor: 'how-to-claim-eth-using-a-withdrawal-nft',
  content: (
    <div>
      <p>
        Claiming bond or rewards as ETH is an stETH withdrawal (unstake). The
        withdrawal process consists of several steps you need to do:
      </p>
      <ul>
        <li>
          <strong>Submit a withdrawal request</strong> by choosing ETH as a
          token for bond/rewards claim. As a result of this step, you will
          receive a withdrawal NFT.
        </li>
        <li>
          <strong>Claim your ETH</strong> after request fulfilment. The
          fulfilment process takes some time,{' '}
          <FaqLink href="https://help.lido.fi/en/articles/7858315-how-long-does-an-ethereum-withdrawal-take">
            depending on a variety of factors
          </FaqLink>
          . To know if your ETH is ready to be claimed you, can check its status
          on the{' '}
          <FaqLink href={`${stakeWidget}/withdrawals/claim`}>
            Claim page
          </FaqLink>
          . If your request is marked as &ldquo;
          <strong>Ready to claim</strong>&rdquo;, it is time for you to get your
          ETH back.
        </li>
      </ul>
      <p>
        For more information about withdrawals,{' '}
        <FaqLink href="https://help.lido.fi/en/collections/3993867-ethereum-withdrawals">
          follow the page
        </FaqLink>
        .
      </p>
      <p>
        Please note addresses in the Reward Splitter will only receive stETH.
      </p>
    </div>
  ),
};

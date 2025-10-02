import React from 'react';
import { Faq } from 'types';

export const Main1: Faq = {
  title: 'Why run an Ethereum validator?',
  anchor: 'why-run-an-ethereum-validator',
  content: (
    <div>
      <p>Running an Ethereum validator allows one to:</p>
      <ol>
        <li>
          <strong>Receive Staking Rewards</strong>: Validators get network
          rewards for performing their duties on the Ethereum blockchain (note:
          incorrectly or not performing duties incurs penalties).{' '}
        </li>
        <li>
          <strong>Support the Network</strong>: By running a validator, you
          actively contribute to the decentralization and security of the
          Ethereum network. Validators play a crucial role in reaching consensus
          and validating transactions, which enhances the network&apos;s
          reliability and resilience.
        </li>
        <li>
          <strong>Learn and Engage with the community</strong>: Operating a
          validator node provides valuable insights into blockchain technology
          and consensus mechanisms. Through hands-on experience, individuals can
          deepen their understanding of Ethereum&apos;s inner workings.
          Moreover, it provides an opportunity to engage with the Ethereum
          community, share knowledge, and contribute to the network&apos;s
          development.
        </li>
      </ol>
    </div>
  ),
};

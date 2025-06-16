import React from 'react';
import { Faq } from 'types';

export const Main4: Faq = {
  title: 'What are the risks of running a validator?',
  anchor: 'what-are-the-risks-of-running-a-validator',
  content: (
    <div>
      <p>Node operators face several risks, including:</p>
      <ol>
        <li>
          <strong>Technical Risk</strong>: Maintaining reliable and secure
          hardware and software setups is essential. Any technical failure or
          vulnerability in the validator setup could lead to penalties.
        </li>
        <li>
          <strong>Penalties for Misbehavior</strong>: Validators can be
          penalized for various reasons, such as going offline or attempting to
          manipulate the network.
        </li>
        <li>
          <strong>Market Risk</strong>: The value of ETH can fluctuate
          significantly, impacting the value of the validator&#39;s staked ETH.
        </li>
        <li>
          <strong>Network Risk</strong>: Validators are part of a decentralized
          network, and the security and stability of the Ethereum network as a
          whole can affect individual validators. Events such as network attacks
          or protocol upgrades may impact validator operations, leading to
          potential disruptions or losses.
        </li>
        <li>
          <strong>Operational Risk</strong>: Validators require ongoing
          maintenance and monitoring to ensure smooth operation. Any operational
          issues, such as hardware failures or connectivity issues, could
          disrupt validator performance and result in rewards losses.
        </li>
        <li>
          <strong>Slashing Risk</strong>: Validators can be slashed, meaning
          they lose a portion of their staked ETH, for violating network rules
          or behaving maliciously. Slashing can occur due to actions such as
          double signing or failing to validate correctly, resulting in
          significant penalties.
        </li>
      </ol>
    </div>
  ),
};

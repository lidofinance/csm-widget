import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmKeys6: Faq = {
  title: 'What are the possible key statuses?',
  anchor: 'what-are-the-possible-key-statuses',
  content: (
    <div>
      <p>Keys in CMv2 can have the following statuses:</p>
      <ul>
        <li>
          <strong>Depositable:</strong> Key is valid and bond is sufficient.
          Pending deposit from Lido Protocol
        </li>
        <li>
          <strong>Pending activation:</strong> Key has been deposited and is
          awaiting activation on the beacon chain
        </li>
        <li>
          <strong>Active:</strong> Key is active on the beacon chain
        </li>
        <li>
          <strong>Exited:</strong> Key has been exited
        </li>
        <li>
          <strong>Withdrawn:</strong> Key has been exited and ETH has been
          returned to the protocol
        </li>
        <li>
          <strong>Unbonded:</strong> Bond is insufficient for this key, which
          can be Active or otherwise
        </li>
        <li>
          <strong>Exit requested:</strong> An exit has been requested by{' '}
          <FaqLink href="https://docs.lido.fi/contracts/validators-exit-bus-oracle/">
            VEBO
          </FaqLink>{' '}
          but the validator has not yet exited
        </li>
        <li>
          <strong>Duplicated:</strong> Key has been uploaded twice either to the
          Lido protocol or Ethereum CL
        </li>
        <li>
          <strong>Invalid:</strong> Uploaded key has an invalid signature
        </li>
      </ul>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/bond-and-key-management#key-statuses">
          See Bond and Key Management
        </FaqLink>
      </p>
    </div>
  ),
};

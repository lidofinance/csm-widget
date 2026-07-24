import React from 'react';
import { Faq } from 'types';

export const CmKeys4: Faq = {
  title: 'Why a key can get ejected?',
  anchor: 'why-a-key-can-get-ejected',
  content: (
    <div>
      <p>
        The protocol can eject your validator if an exit request from the
        Validators Exit Bus Oracle (VEBO) was not processed within the required
        window.
      </p>
      <p>
        You can also eject your own validator voluntarily using Triggerable
        Withdrawals.
      </p>
    </div>
  ),
};

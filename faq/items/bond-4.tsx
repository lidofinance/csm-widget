import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Bond4: Faq = {
  title: 'Why add a bond?',
  anchor: 'why-add-a-bond',
  content: (
    <div>
      <p>
        Adding bond is a prevention measure to avoid Exit Request for your
        validators if they became unbonded.{' '}
        <FaqLink href="https://docs.lido.fi/staking-modules/csm/guides/unbonded-validators">
          Unbonded validators
        </FaqLink>{' '}
        appear if the Node Operator&#39;s bond is no longer sufficient to cover
        all the validator keys uploaded to CSM by the Node Operator.
      </p>
      <p>
        If a{' '}
        <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-3951aa72ba1e471bafe95b40fef65d2b">
          penalty
        </FaqLink>{' '}
        was already applied, there is a relatively short period of time until
        the next VEBO report, which most likely will contain a validator Exit
        Request. During this period in between penalty application and the next
        VEBO report, Node Operators must top up bond to avoid Exit Requests for
        their validator(s).
      </p>
      <p>
        <strong>Warning:</strong> If the unbonded validator has already been
        requested to exit, Node Operators can only exit it. The bond top-up
        after the Exit Request will not reverse the Exit Request.
      </p>
    </div>
  ),
};

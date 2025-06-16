import { FaqLink } from 'shared/components';
import { Faq } from 'types';

export const Roles2: Faq = {
  title: 'Why should these addresses be different?',
  anchor: 'why-should-these-addresses-be-different',
  content: (
    <div>
      <p>
        It&#39;s recommended to use different addresses for security reasons.
        For example, a hot wallet may be used for the Manager Address to
        simplify daily operations, while a cold wallet (or something like a
        Safe) is preferable for the Rewards Address to enhance security.
      </p>
      <p>
        Read more about addresses management{' '}
        <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-d3ad2b2bd3994a06b19dccc0794ac8d6">
          here
        </FaqLink>
        .
      </p>
    </div>
  ),
};

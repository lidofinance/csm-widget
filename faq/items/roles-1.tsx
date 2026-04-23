import { ROLES } from '@lidofinance/lido-csm-sdk';
import React from 'react';
import { Faq } from 'types';
import { FaqLink, RoleActionsList } from 'shared/components';

export const Roles1: Faq = {
  title: 'What are rewards and manager addresses?',
  anchor: 'what-are-rewards-and-manager-addresses',
  content: (
    <div>
      <p>
        There are two addresses associated with your Node Operator that have
        different scope of responsibilities for managing your Node Operator.{' '}
      </p>
      <RoleActionsList
        role={ROLES.REWARDS}
        extendedManagerPermissions={false}
      />
      <RoleActionsList
        role={ROLES.MANAGER}
        extendedManagerPermissions={false}
      />
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

import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';

import { mnemonicToAccount } from 'viem/accounts';
import { Tags } from 'tests/consts/common.const';
import { ROLES } from 'tests/consts/roles';
import { InboxRequestsPage } from 'tests/pages/tabs/roles';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe(
  'Roles. Inbox Rewards. Accept rewards ',
  {
    tag: [Tags.performTX, Tags.forked],
  },
  () => {
    let randomId: number;
    let inboxRequestsPage: InboxRequestsPage;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ widgetService, secretPhrase, csmSDK }) => {
      const operators = await csmSDK.getNodeOperatorsByAddress(
        mnemonicToAccount(secretPhrase).address,
      );
      const forbiddenIds = operators.map((x) => Number(x.id));
      randomId = Array.from({ length: 200 }, (_, i) => i + 1)
        .filter((id) => !forbiddenIds.includes(id))
        .at(Math.floor(Math.random() * (200 - forbiddenIds.length))) as number;
      inboxRequestsPage = widgetService.rolesPage.inboxRequestsPage;
    });

    test(
      qase(309, 'Verify accept request for reward invite'),
      async ({ forkActionService, secretPhrase }) => {
        await forkActionService.proposeReward(
          randomId,
          mnemonicToAccount(secretPhrase).address,
        );
        await inboxRequestsPage.open();

        const expectedRequest = inboxRequestsPage.getRequestLocator(
          randomId,
          ROLES.REWARDS,
        );

        await expect(expectedRequest).toBeVisible();
        await expectedRequest.click();
        await expect(expectedRequest).toBeChecked();

        await inboxRequestsPage.acceptRequest(randomId, ROLES.REWARDS);
        await expectedRequest.waitFor({ state: 'hidden' });
      },
    );

    test(
      qase(310, 'Verify accept request for manager invite'),
      async ({ forkActionService, secretPhrase }) => {
        await forkActionService.proposeManager(
          randomId,
          mnemonicToAccount(secretPhrase).address,
        );
        await inboxRequestsPage.open();

        const expectedRequest = inboxRequestsPage.getRequestLocator(
          randomId,
          ROLES.MANAGER,
        );

        await expect(expectedRequest).toBeVisible();
        await expectedRequest.click();
        await expect(expectedRequest).toBeChecked();

        await inboxRequestsPage.acceptRequest(randomId, ROLES.REWARDS);
        await expectedRequest.waitFor({ state: 'hidden' });
      },
    );
  },
);

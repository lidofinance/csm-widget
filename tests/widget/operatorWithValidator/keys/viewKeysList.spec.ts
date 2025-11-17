import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { KeysPage } from 'tests/pages';

const keysStatusesExpectedComments = [
  {
    status: 'Invalid',
    defaultCommentText: 'Remove the key',
    commentTextWithStrikes: undefined,
  },
  {
    status: 'Unchecked',
    defaultCommentText:
      'Resolve the issues with all keys in Duplicated and Invalid statuses',
    commentTextWithStrikes: undefined,
  },
  {
    status: 'Active',
    defaultCommentText: undefined,
    commentTextWithStrikes:
      'Check out the tips on how to improve your performance',
  },
  {
    status: 'Withdrawn',
    defaultCommentText: undefined,
    commentTextWithStrikes: undefined,
  },
  // @TODO: Should to add more test data for other statuses
];

test.describe('View keys list. Common', async () => {
  let keysPage: KeysPage;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await keysPage.keysView.open();
    await keysPage.keysView.table.waitFor({ state: 'visible' });
  });

  test(qase(148, 'Verification of displayed key statuses'), async () => {
    const keysList = await keysPage.keysView.getAllTableRows();

    await test.step('Check each column for all keys', async () => {
      for (const key of keysList) {
        await expect(
          key.pubkeyCell,
          'Expected that value of pubkley cell wont be empty.',
        ).not.toBeEmpty();
        await expect(
          key.statusCell,
          'Expected that value of status cell wont be empty.',
        ).not.toBeEmpty();
        await expect(
          key.strikesCountCell,
          'Expected that strikes value  wont be empty.',
        ).not.toBeEmpty();
      }
    });
  });

  keysStatusesExpectedComments.forEach((statusExpectedCommentData) => {
    test(
      qase(
        248,
        `Verification comments of keys with "${statusExpectedCommentData.status}" status`,
      ),
      async () => {
        const keyRow = await keysPage.keysView.getRowByStatus(
          statusExpectedCommentData.status,
        );
        test.skip(
          !keyRow,
          `There is no key with ${statusExpectedCommentData.status} status`,
        );

        const strikesCount = await keyRow?.strikesCountCell.textContent();
        // @ts-expect-error keyRow is checked by test.skip
        const statusCommentCell = keyRow.statusCommentCell;

        if (strikesCount === '0/3') {
          await test.step('Check comment for key without strikes', async () => {
            if (statusExpectedCommentData.defaultCommentText) {
              await expect(statusCommentCell).toContainText(
                statusExpectedCommentData.defaultCommentText,
              );
            } else {
              await expect(statusCommentCell).not.toBeVisible();
            }
          });
        } else {
          await test.step('Check comment for key with strikes', async () => {
            if (statusExpectedCommentData.commentTextWithStrikes) {
              await expect(statusCommentCell).toContainText(
                statusExpectedCommentData.commentTextWithStrikes,
              );
            } else {
              await expect(statusCommentCell).not.toBeVisible();
            }
          });
        }
      },
    );
  });
});

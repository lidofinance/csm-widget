import {
  WalletConnectType,
  WalletPage,
} from '@lidofinance/wallets-testing-wallets';
import { Locator, Page, test } from '@playwright/test';
import { ROLES, SHORT_ROLES } from 'tests/consts/roles';
import {
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { BasePage } from 'tests/pages/base.page';

export class InboxRequestsPage extends BasePage {
  acceptRequestButton: Locator;

  constructor(
    public page: Page,
    public walletPage: WalletPage<WalletConnectType>,
  ) {
    super(page);

    this.acceptRequestButton = this.page.getByRole('button', {
      name: 'Accept request',
    });
  }

  async open() {
    await test.step('Open Inbox Requests tab', async () => {
      await this.page.goto('/roles/inbox');
    });
  }

  getRequestLocator(noNumber: number, role: ROLES) {
    const requestId = `${SHORT_ROLES[role]}-${noNumber}`;
    return this.page.locator(
      `xpath=//input[@value="${requestId}"]/ancestor::label`,
    );
  }

  async acceptRequest(noNumber: number, role: ROLES) {
    await test.step(`Accept ${role} request for #${noNumber} node operator`, async () => {
      await test.step('Accept request', async () => {
        const [txPage] = await Promise.all([
          this.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          this.acceptRequestButton.click(),
        ]);

        await this.page.waitForSelector(
          `text=You are accepting address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await this.walletPage.confirmTx(txPage);

        await this.page.waitForSelector(
          `text=Address change has been accepted`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await this.closeModalWindow();
    });
  }
}

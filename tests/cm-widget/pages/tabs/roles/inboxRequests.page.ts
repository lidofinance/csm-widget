import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { Locator, Page, test } from '@playwright/test';
import { ROLES, SHORT_ROLES } from 'tests/shared/consts/roles';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { BasePage } from '../../../../shared/pages/base.page';

export class InboxRequestsPage extends BasePage {
  acceptRequestButton: Locator;

  constructor(
    public page: Page,
    public walletPage: WalletPage,
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
        await this.acceptRequestButton.click();

        await this.page.waitForSelector(
          `text=You are accepting address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await this.walletPage.confirmTx();

        await this.page.waitForSelector(
          `text=Address change has been accepted`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await this.closeModalWindow();
    });
  }
}

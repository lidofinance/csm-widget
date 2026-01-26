import { Locator, Page, test } from '@playwright/test';
import {
  WalletConnectType,
  WalletPage,
} from '@lidofinance/wallets-testing-wallets';
import {
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { BasePage } from 'tests/pages/base.page';

export class SignInForm extends BasePage {
  form: Locator;
  mainAddressInput: Locator;
  mainAddressLabel: Locator;

  constructor(
    page: Page,
    public walletPage: WalletPage<WalletConnectType>,
  ) {
    super(page);
    this.form = page.getByTestId('signInForm');
    this.mainAddressInput = this.form.locator('input[name="mainAddress"]');
    this.mainAddressLabel = this.form.locator(
      'xpath=//input[@name="mainAddress"]/ancestor::label',
    );
  }

  async signIn() {
    let txPage;
    await test.step('Sign in a message to prove ownership', async () => {
      const signInButton = this.form.getByRole('button', { name: 'Sign in' });

      [txPage] = await Promise.all([
        this.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
        signInButton.click(),
      ]);
      await this.page.waitForSelector(`text=Please sign the message`, {
        timeout: STAGE_WAIT_TIMEOUT,
      });

      await this.walletPage.confirmTx(txPage);

      await this.page.waitForSelector(`text=Submit application`, {
        timeout: STAGE_WAIT_TIMEOUT,
      });
    });
  }
}

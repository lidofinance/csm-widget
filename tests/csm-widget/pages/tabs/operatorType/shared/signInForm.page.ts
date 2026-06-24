import { Locator, Page, test } from '@playwright/test';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { BasePage } from '../../../../../shared/pages/base.page';

export class SignInForm extends BasePage {
  form: Locator;
  mainAddressInput: Locator;
  mainAddressLabel: Locator;

  constructor(
    page: Page,
    public walletPage: WalletPage,
  ) {
    super(page);
    this.form = page.getByTestId('signInForm');
    this.mainAddressInput = this.form.locator('input[name="mainAddress"]');
    this.mainAddressLabel = this.form.locator(
      'xpath=//input[@name="mainAddress"]/ancestor::label',
    );
  }

  async signIn() {
    await test.step('Sign in a message to prove ownership', async () => {
      const signInButton = this.form.getByRole('button', { name: 'Sign in' });

      await signInButton.click();
      await this.page.waitForSelector(`text=Please sign the message`, {
        timeout: STAGE_WAIT_TIMEOUT,
      });

      await this.walletPage.confirmTx();

      await this.page.waitForSelector(`text=Submit application`, {
        timeout: STAGE_WAIT_TIMEOUT,
      });
    });
  }
}

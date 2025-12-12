import { Page, test } from '@playwright/test';
import {
  WalletConnectType,
  WalletPage,
} from '@lidofinance/wallets-testing-wallets';
import { SignInForm } from './applicationFormStates/signIn.page';

export class ApplicationForm {
  page: Page;
  signInForm: SignInForm;

  constructor(
    page: Page,
    public walletPage: WalletPage<WalletConnectType>,
  ) {
    this.page = page;
    this.signInForm = new SignInForm(page, walletPage);
  }

  async open() {
    await test.step('Open Application Form tab for Operator Type page', async () => {
      await this.page.goto('/type/ics-apply/?ics-apply');
    });
  }
}

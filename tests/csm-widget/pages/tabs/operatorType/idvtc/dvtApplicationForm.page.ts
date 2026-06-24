import { Page, test } from '@playwright/test';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { SignInForm } from '../shared/signInForm.page';
import { DvtApplyForm } from './dvtApplyForm.page';

export class DvtApplicationForm {
  page: Page;
  signInForm: SignInForm;
  applyForm: DvtApplyForm;

  constructor(
    page: Page,
    public walletPage: WalletPage,
  ) {
    this.page = page;
    this.signInForm = new SignInForm(page, walletPage);
    this.applyForm = new DvtApplyForm(page, walletPage);
  }

  async open() {
    await test.step('Open IDVTC Application Form tab for Operator Type page', async () => {
      await this.page.goto('/type/idvtc-apply');
    });
  }
}

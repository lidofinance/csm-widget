import { Page, test } from '@playwright/test';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { SignInForm } from '../shared/signInForm.page';
import { SubmitApplicationForm } from './submitApplicationForm.page';
import { ApplicationFormStatus } from './applicationFormStatus.page';

export class ApplicationForm {
  page: Page;
  signInForm: SignInForm;
  submitApplicationForm: SubmitApplicationForm;
  applicationFormStatus: ApplicationFormStatus;

  constructor(
    page: Page,
    public walletPage: WalletPage,
  ) {
    this.page = page;
    this.signInForm = new SignInForm(page, walletPage);
    this.submitApplicationForm = new SubmitApplicationForm(page, walletPage);
    this.applicationFormStatus = new ApplicationFormStatus(page);
  }

  async open() {
    await test.step('Open Application Form tab for Operator Type page', async () => {
      await this.page.goto('/type/ics-apply');
    });
  }
}

import { Page, test } from '@playwright/test';
import {
  WalletConnectType,
  WalletPage,
} from '@lidofinance/wallets-testing-wallets';
import { SignInForm } from './applicationFormStates/signInForm.page';
import { SubmitApplicationForm } from './applicationFormStates/submitApplicationForm.page';
import { ApplicationFormStatus } from './applicationFormStates/applicationFormStatus.page';

export class ApplicationForm {
  page: Page;
  signInForm: SignInForm;
  submitApplicationForm: SubmitApplicationForm;
  applicationFormStatus: ApplicationFormStatus;

  constructor(
    page: Page,
    public walletPage: WalletPage<WalletConnectType>,
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

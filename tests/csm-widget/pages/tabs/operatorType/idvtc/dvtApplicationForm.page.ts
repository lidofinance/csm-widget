import { Locator, Page, test } from '@playwright/test';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { SignInForm } from '../shared/signInForm.page';
import { DvtApplyForm } from './dvtApplyForm.page';
import { DvtApplicationFormStatus } from './dvtApplicationFormStatus.page';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

export class DvtApplicationForm {
  page: Page;
  loader: Locator;
  signInForm: SignInForm;
  applyForm: DvtApplyForm;
  applicationFormStatus: DvtApplicationFormStatus;

  constructor(
    page: Page,
    public walletPage: WalletPage,
  ) {
    this.page = page;
    this.loader = this.page.getByTestId('loader');
    this.signInForm = new SignInForm(page, walletPage);
    this.applyForm = new DvtApplyForm(page, walletPage);
    this.applicationFormStatus = new DvtApplicationFormStatus(page);
  }

  async open() {
    await test.step('Open IDVTC Application Form tab for Operator Type page', async () => {
      await this.page.goto('/type/idvtc-apply');
      await this.loader.waitFor({
        state: 'detached',
        timeout: RPC_WAIT_TIMEOUT,
      });
    });
  }
}

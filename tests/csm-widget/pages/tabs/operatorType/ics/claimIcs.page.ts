import { Locator, Page, test } from '@playwright/test';
import { BasePage } from 'tests/shared/pages/base.page';

export class ClaimIcsPage extends BasePage {
  page: Page;
  title: Locator;
  formTitle: Locator;
  whatsChanging: Locator;
  viewFullListButton: Locator;
  parameterChanges: Locator;
  claimButton: Locator;
  confirmModal: Locator;
  confirmContinueButton: Locator;
  successScreen: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = this.page
      .getByTestId('pageTitle')
      .locator('[aria-current="page"]');
    this.formTitle = this.page.getByTestId('formTitle');
    this.whatsChanging = this.page.getByTestId('claimChanges');
    this.viewFullListButton =
      this.whatsChanging.getByTestId('viewFullListButton');
    this.parameterChanges = this.page.getByTestId('parameterChangesModal');
    this.claimButton = this.page.getByRole('button', {
      name: 'Claim operator type',
    });
    this.confirmModal = this.page.locator('div[role="dialog"]', {
      hasText: 'You are claiming the Identified Community Staker operator type',
    });
    this.confirmContinueButton = this.confirmModal.getByRole('button', {
      name: 'Continue',
    });
    this.successScreen = this.page.getByTestId('successScreen');
  }

  async open() {
    await test.step('Open the ICS claim page', async () => {
      await this.openWithRetry('/type/ics-claim', this.claimButton);
    });
  }
}

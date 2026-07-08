import { Locator, Page, test } from '@playwright/test';

export class ClaimIcsPage {
  page: Page;
  title: Locator;
  subtitle: Locator;
  formTitle: Locator;
  claimButton: Locator;
  confirmModal: Locator;
  confirmContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.getByTestId('pageTitle');
    this.subtitle = this.page.getByTestId('pageSubtitle');
    this.formTitle = this.page.getByTestId('formTitle');
    this.claimButton = this.page.getByRole('button', {
      name: 'Claim operator type',
    });
    this.confirmModal = this.page.locator('div[role="dialog"]', {
      hasText: 'You are claiming the Identified Community Staker operator type',
    });
    this.confirmContinueButton = this.confirmModal.getByRole('button', {
      name: 'Continue',
    });
  }

  async open() {
    await test.step('Open the ICS claim page', async () => {
      await this.page.goto('/type/ics-claim');
    });
  }
}

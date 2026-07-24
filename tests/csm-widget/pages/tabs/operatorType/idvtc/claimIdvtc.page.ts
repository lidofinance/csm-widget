import { Locator, Page, test } from '@playwright/test';

export class ClaimIdvtcPage {
  page: Page;
  title: Locator;
  subtitle: Locator;
  formTitle: Locator;
  parameterChanges: Locator;
  claimButton: Locator;
  confirmModal: Locator;
  confirmContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.getByTestId('pageTitle');
    this.subtitle = this.page.getByTestId('pageSubtitle');
    this.formTitle = this.page.getByTestId('formTitle');
    this.parameterChanges = this.page.getByText('Parameter changes', {
      exact: true,
    });
    this.claimButton = this.page.getByRole('button', {
      name: 'Claim operator type',
    });
    this.confirmModal = this.page.locator('div[role="dialog"]', {
      hasText: 'You are claiming the Identified DVT Cluster operator type',
    });
    this.confirmContinueButton = this.confirmModal.getByRole('button', {
      name: 'Continue',
    });
  }

  async open() {
    await test.step('Open the IDVTC claim page', async () => {
      await this.page.goto('/type/idvtc-claim');
    });
  }

  async expandParameterChanges() {
    await test.step('Expand parameter changes', async () => {
      await this.parameterChanges.click();
    });
  }

  getColumn(title: string): Locator {
    return this.page.getByText(title, { exact: true });
  }

  getParameter(title: string): Locator {
    return this.page.getByTestId('parameterTitle').filter({ hasText: title });
  }
}

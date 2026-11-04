import { Locator, Page, test } from '@playwright/test';
import { BasePage } from 'tests/shared/pages/base.page';

export class ClaimIdvtcPage extends BasePage {
  page: Page;
  title: Locator;
  subtitle: Locator;
  formTitle: Locator;
  whatsChanging: Locator;
  viewFullListButton: Locator;
  parameterChanges: Locator;
  claimButton: Locator;
  confirmModal: Locator;
  confirmContinueButton: Locator;
  successScreen: Locator;
  dkgRequiredCard: Locator;
  dkgUploadFilesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = this.page
      .getByTestId('pageTitle')
      .locator('[aria-current="page"]');
    this.subtitle = this.page.getByTestId('pageSubtitle');
    this.formTitle = this.page.getByTestId('formTitle');
    this.whatsChanging = this.page.getByTestId('claimChanges');
    this.viewFullListButton =
      this.whatsChanging.getByTestId('viewFullListButton');
    this.parameterChanges = this.page.getByTestId('parameterChangesModal');
    this.claimButton = this.page.getByRole('button', {
      name: 'Claim operator type',
    });
    this.confirmModal = this.page.locator('div[role="dialog"]', {
      hasText: 'You are claiming the Identified DVT Cluster operator type',
    });
    this.confirmContinueButton = this.confirmModal.getByRole('button', {
      name: 'Continue',
    });
    this.successScreen = this.page.getByTestId('successScreen');
    this.dkgRequiredCard = this.page.getByTestId('dkgRequiredCard');
    this.dkgUploadFilesButton = this.dkgRequiredCard.getByRole('button', {
      name: 'Upload files',
    });
  }

  async open() {
    await test.step('Open the IDVTC claim page', async () => {
      await this.openWithRetry('/type/idvtc-claim', this.claimButton);
    });
  }

  async openParameterChanges() {
    await test.step('Open the full parameter list', async () => {
      await this.viewFullListButton.click();
      await this.parameterChanges.waitFor();
    });
  }

  getColumn(title: string): Locator {
    return this.parameterChanges.getByText(title, { exact: true });
  }

  getParameter(title: string): Locator {
    return this.parameterChanges
      .getByTestId('parameterTitle')
      .filter({ hasText: title });
  }
}

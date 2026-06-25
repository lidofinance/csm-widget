import { Locator, Page, test } from '@playwright/test';

export class DvtApplicationFormStatus {
  page: Page;
  form: Locator;
  applicationStatus: Locator;
  statusChip: Locator;
  operatorTypeStatus: Locator;
  operatorTypeChip: Locator;

  applicationSection: Locator;
  applicationInfo: Locator;
  submittedDate: Locator;

  mainAddressInput: Locator;
  discordLinkInput: Locator;
  telegramUsernameInput: Locator;

  clusterMembersTitle: Locator;
  applyAgainBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('applicationFormStatus');
    this.applicationStatus = this.form.getByTestId('applicationStatus');
    this.statusChip = this.applicationStatus.getByTestId('scoreChip');
    this.operatorTypeStatus = this.form.getByTestId('operatorTypeStatus');
    this.operatorTypeChip = this.operatorTypeStatus.getByTestId('scoreChip');

    this.applicationSection = this.form.getByTestId('applicationSection');
    this.applicationInfo =
      this.applicationSection.getByTestId('applicationInfo');
    this.submittedDate = this.applicationSection.getByTestId('submittedDate');

    this.mainAddressInput = this.applicationSection.locator(
      'input[name="mainAddress"]',
    );
    this.discordLinkInput = this.applicationSection.locator(
      'input[name="discordLink"]',
    );
    this.telegramUsernameInput = this.applicationSection.locator(
      'input[name="telegramUsername"]',
    );

    this.clusterMembersTitle = this.applicationSection.getByTestId(
      'clusterMembersTitle',
    );
    this.applyAgainBtn = this.form.getByRole('button', { name: 'Apply again' });
  }

  getClusterMemberInfo(index: number) {
    return this.applicationSection.getByTestId(`clusterMemberInfo-${index}`);
  }

  getClusterMemberAddress(index: number) {
    return this.getClusterMemberInfo(index).getByTestId('addressText');
  }

  async expand() {
    await test.step('Expand the application details', async () => {
      await this.applicationInfo.click();
      await this.mainAddressInput.waitFor({ state: 'visible' });
    });
  }
}

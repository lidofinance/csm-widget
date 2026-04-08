import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { BondRewards } from './elements/dashboard/element.bondRewards';
import { KeysSection } from './elements/dashboard/element.keysSection';
import { RolesSection } from './elements/dashboard/element.rolesSection';

export class DashboardPage extends BasePage {
  keysSection: KeysSection;
  bondRewards: BondRewards;
  rolesSection: RolesSection;

  whyModal: Locator;
  operatorGroupLink: Locator;

  constructor(page: Page) {
    super(page);
    this.keysSection = new KeysSection(this.page);
    this.bondRewards = new BondRewards(this.page);
    this.rolesSection = new RolesSection(this.page);

    this.whyModal = this.page.getByTestId('whyModal');
    this.operatorGroupLink = this.page.getByTestId('operatorGroupLink');
  }

  async open() {
    await test.step('Open the Dasboard page', async () => {
      await this.openWithRetry('/', [
        this.bondRewards.bondBalance.commonBalance_Text,
      ]);
    });
  }
}

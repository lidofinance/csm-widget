import { Locator, Page } from '@playwright/test';
import { BasePage } from 'tests/pages/base.page';
import { test } from '@playwright/test';

class AvailableToClaimBlock {
  expandedBlock: Locator;
  button: Locator;
  commonBalance: Locator;
  commonBalance_Text: Locator;
  commonBalance_SubText: Locator;

  rewardsBalance: Locator;
  rewardsBalance_Title: Locator;
  rewardsBalance_TitleIcon: Locator;
  rewardsBalance_Text: Locator;
  rewardsBalance_SubText: Locator;

  excessBondBalance: Locator;
  excessBondBalance_Title: Locator;
  excessBondBalance_TitleIcon: Locator;
  excessBondBalance_Text: Locator;
  excessBondBalance_SubText: Locator;

  constructor(section: Locator) {
    this.expandedBlock = section.getByTestId('availableToClaimBlock');
    this.button = this.expandedBlock.getByRole('button');

    // Common Balance
    this.commonBalance = this.expandedBlock.getByTestId('commonBalance');
    this.commonBalance_Text = this.commonBalance.getByTestId('textContent');
    this.commonBalance_SubText =
      this.commonBalance.getByTestId('subtextContent');

    // Rewards Balance
    this.rewardsBalance = this.expandedBlock.getByTestId('rewardsBalance');
    this.rewardsBalance_Title =
      this.rewardsBalance.getByTestId('textTitleContent');
    this.rewardsBalance_TitleIcon = this.rewardsBalance_Title.locator('svg');
    this.rewardsBalance_Text = this.rewardsBalance.getByTestId('textContent');
    this.rewardsBalance_SubText =
      this.rewardsBalance.getByTestId('subtextContent');

    // Excess Bond Balance
    this.excessBondBalance =
      this.expandedBlock.getByTestId('excessBondBalance');
    this.excessBondBalance_Title =
      this.excessBondBalance.getByTestId('textTitleContent');
    this.excessBondBalance_TitleIcon =
      this.excessBondBalance_Title.locator('svg');
    this.excessBondBalance_Text =
      this.excessBondBalance.getByTestId('textContent');
    this.excessBondBalance_SubText =
      this.excessBondBalance.getByTestId('subtextContent');
  }

  async expand() {
    await test.step('Expand the "Available to claim" section', async () => {
      await this.button.click();
      await this.rewardsBalance.waitFor({ state: 'visible' });
    });
  }
}

class BondBalanceBlock {
  expandedBlock: Locator;
  button: Locator;
  commonBalance: Locator;
  commonBalance_Text: Locator;
  commonBalance_SubText: Locator;

  requiredBondBalance: Locator;
  requiredBondBalance_Title: Locator;
  requiredBondBalance_TitleIcon: Locator;
  requiredBondBalance_Text: Locator;
  requiredBondBalance_SubText: Locator;

  excessBondBalance: Locator;
  excessBondBalance_Title: Locator;
  excessBondBalance_TitleIcon: Locator;
  excessBondBalance_Text: Locator;
  excessBondBalance_SubText: Locator;

  constructor(section: Locator) {
    this.expandedBlock = section.getByTestId('bondBalanceBlock');
    this.button = this.expandedBlock.getByRole('button');

    // Common Balance
    this.commonBalance = this.expandedBlock.getByTestId('commonBalance');
    this.commonBalance_Text = this.commonBalance.getByTestId('textContent');
    this.commonBalance_SubText =
      this.commonBalance.getByTestId('subtextContent');

    // Required Balance
    this.requiredBondBalance = this.expandedBlock.getByTestId(
      'requiredBondBalance',
    );
    this.requiredBondBalance_Title =
      this.requiredBondBalance.getByTestId('textTitleContent');
    this.requiredBondBalance_TitleIcon =
      this.requiredBondBalance.locator('svg');
    this.requiredBondBalance_Text =
      this.requiredBondBalance.getByTestId('textContent');
    this.requiredBondBalance_SubText =
      this.requiredBondBalance.getByTestId('subtextContent');

    // Excess Bond Balance
    this.excessBondBalance =
      this.expandedBlock.getByTestId('excessBondBalance');
    this.excessBondBalance_Title =
      this.excessBondBalance.getByTestId('textTitleContent');
    this.excessBondBalance_TitleIcon = this.excessBondBalance.locator('svg');
    this.excessBondBalance_Text =
      this.excessBondBalance.getByTestId('textContent');
    this.excessBondBalance_SubText =
      this.excessBondBalance.getByTestId('subtextContent');
  }

  async expand() {
    await test.step('Expand the "Bond balance" section', async () => {
      await this.button.click();
      await this.requiredBondBalance.waitFor({ state: 'visible' });
    });
  }
}

export class BondRewards extends BasePage {
  page: Page;

  // Section Header
  section: Locator;
  sectionHeaderLink: Locator;

  // Available to claim
  availableToClaim: AvailableToClaimBlock;

  // Bond balance
  bondBalance: BondBalanceBlock;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Section Header
    this.section = this.page.getByTestId('bondRewardsSection');
    this.sectionHeaderLink = this.section.getByTestId('sectionHeaderLink');

    // Available to claim
    this.availableToClaim = new AvailableToClaimBlock(this.section);

    // Bond balance
    this.bondBalance = new BondBalanceBlock(this.section);
  }
}

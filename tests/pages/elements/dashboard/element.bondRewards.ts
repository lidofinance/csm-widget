import { Locator, Page } from '@playwright/test';

class AvailableToClaimBlock {
  expandedBlock: Locator;
  button: Locator;
  commonBalance: Locator;
  commonBalance_Text: Locator;
  commonBalance_SubText: Locator;

  rewardsBalance: Locator;
  rewardsBalance_Text: Locator;
  rewardsBalance_SubText: Locator;

  excessBondBalance: Locator;
  excessBondBalance_Text: Locator;
  excessBondBalance_SubText: Locator;

  constructor(section: Locator) {
    this.expandedBlock = section.getByTestId('availableToClaimBlock');
    this.button = this.expandedBlock.getByRole('button');

    // Available to claim Common Balance
    this.commonBalance = this.expandedBlock.getByTestId('commonBalance');
    this.commonBalance_Text = this.commonBalance.getByTestId('textContent');
    this.commonBalance_SubText =
      this.commonBalance.getByTestId('subtextContent');

    // Available to claim Rewards Balance
    this.rewardsBalance = this.expandedBlock.getByTestId('rewardsBalance');
    this.rewardsBalance_Text = this.rewardsBalance.getByTestId('textContent');
    this.rewardsBalance_SubText =
      this.rewardsBalance.getByTestId('subtextContent');

    // Available to claim Excess Bond Balance
    this.excessBondBalance =
      this.expandedBlock.getByTestId('excessBondBalance');
    this.excessBondBalance_Text =
      this.excessBondBalance.getByTestId('textContent');
    this.excessBondBalance_SubText =
      this.excessBondBalance.getByTestId('subtextContent');
  }
}

class BondBalanceBlock {
  expandedBlock: Locator;
  button: Locator;
  commonBalance: Locator;
  commonBalance_Text: Locator;
  commonBalance_SubText: Locator;

  requiredBondBalance: Locator;
  requiredBondBalance_Text: Locator;
  requiredBondBalance_SubText: Locator;

  excessBondBalance: Locator;
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

    // Rewards Balance
    this.requiredBondBalance = this.expandedBlock.getByTestId(
      'requiredBondBalance',
    );
    this.requiredBondBalance_Text =
      this.requiredBondBalance.getByTestId('textContent');
    this.requiredBondBalance_SubText =
      this.requiredBondBalance.getByTestId('subtextContent');

    // Excess Bond Balance
    this.excessBondBalance =
      this.expandedBlock.getByTestId('excessBondBalance');
    this.excessBondBalance_Text =
      this.excessBondBalance.getByTestId('textContent');
    this.excessBondBalance_SubText =
      this.excessBondBalance.getByTestId('subtextContent');
  }
}

export class BondRewards {
  page: Page;

  // Section Header
  section: Locator;
  sectionHeaderLink: Locator;

  // Available to claim
  availableToClaim: AvailableToClaimBlock;

  // Bond balance
  bondBalance: BondBalanceBlock;

  constructor(page: Page) {
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

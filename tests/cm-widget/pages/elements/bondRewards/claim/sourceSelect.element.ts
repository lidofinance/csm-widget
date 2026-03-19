import { Locator } from '@playwright/test';

export class SourceSelect {
  section: Locator;

  // Rewards
  rewards: Locator;
  rewardsTokenAmount: Locator;
  rewardsUSDPrice: Locator;

  // Excess bond
  excessBond: Locator;
  excessBondTokenAmount: Locator;
  excessBondUSDPrice: Locator;

  constructor(form: Locator) {
    this.section = form.getByTestId('sourceSelect');

    // Rewards
    this.rewards = this.section.getByTestId('rewardsSource');
    this.rewardsTokenAmount = this.rewards.getByTestId('amountPrice');
    this.rewardsUSDPrice = this.rewardsTokenAmount.getByTestId('usdPrice');

    // Excess bond
    this.excessBond = this.section.getByTestId('excessBondSource');
    this.excessBondTokenAmount = this.excessBond.getByTestId('amountPrice');
    this.excessBondUSDPrice =
      this.excessBondTokenAmount.getByTestId('usdPrice');
  }
}

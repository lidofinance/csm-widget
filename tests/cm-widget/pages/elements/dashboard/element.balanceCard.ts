import { Locator, Page } from '@playwright/test';

export class BalanceCard {
  root: Locator;
  link: Locator;
  commonBalance: Locator;
  requiredBondBalance: Locator;
  excessBondBalance: Locator;
  rewardsBalance: Locator;
  lockedBondBalance: Locator;
  debtBalance: Locator;
  pendingToSplitBalance: Locator;
  toSplittersBalance: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('bondBalanceBlock');
    this.link = this.root.getByTestId('sectionHeaderLink');
    this.commonBalance = this.root.getByTestId('commonBalance');
    this.requiredBondBalance = this.root.getByTestId('requiredBondBalance');
    this.excessBondBalance = this.root.getByTestId('excessBondBalance');
    this.rewardsBalance = this.root.getByTestId('rewardsBalance');
    this.lockedBondBalance = this.root.getByTestId('lockedBondBalance');
    this.debtBalance = this.root.getByTestId('debtBalance');
    this.pendingToSplitBalance = this.root.getByTestId('pendingToSplitBalance');
    this.toSplittersBalance = this.root.getByTestId('toSplittersBalance');
  }
}

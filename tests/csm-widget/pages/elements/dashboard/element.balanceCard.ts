import { Locator, Page } from '@playwright/test';

export class BalanceCard {
  root: Locator;
  link: Locator;
  value: Locator;
  requiredBond: Locator;
  excessBond: Locator;
  rewards: Locator;
  lockedBond: Locator;
  debt: Locator;
  pendingToSplit: Locator;
  toSplitters: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('bondBalanceBlock');
    this.link = this.root.getByTestId('sectionHeaderLink');
    this.value = this.root.getByTestId('commonBalance');
    this.requiredBond = this.root.getByTestId('requiredBondBalance');
    this.excessBond = this.root.getByTestId('excessBondBalance');
    this.rewards = this.root.getByTestId('rewardsBalance');
    this.lockedBond = this.root.getByTestId('lockedBondBalance');
    this.debt = this.root.getByTestId('debtBalance');
    this.pendingToSplit = this.root.getByTestId('pendingToSplitBalance');
    this.toSplitters = this.root.getByTestId('toSplittersBalance');
  }
}

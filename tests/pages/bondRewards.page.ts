import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AddBondPage } from './tabs/bondRewards/addBond.page';

export class BondRewardsPage extends BasePage {
  addBond: AddBondPage;

  constructor(public page: Page) {
    super(page);
    this.addBond = new AddBondPage(page);
  }
}

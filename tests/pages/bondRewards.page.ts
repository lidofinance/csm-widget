import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AddBondPage } from './tabs/bondRewards/addBond.page';
import { ClaimPage } from './tabs/bondRewards/claim.page';

export class BondRewardsPage extends BasePage {
  claim: ClaimPage;
  addBond: AddBondPage;

  constructor(public page: Page) {
    super(page);
    this.claim = new ClaimPage(page);
    this.addBond = new AddBondPage(page);
  }
}

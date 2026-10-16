import { Page } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { AddBondPage } from './tabs/bondRewards/addBond.page';
import { ClaimPage } from './tabs/bondRewards/claim.page';
import { UnlockBondPage } from './tabs/bondRewards/unlockBond.page';

export class BondRewardsPage extends BasePage {
  claim: ClaimPage;
  addBond: AddBondPage;
  unlockBond: UnlockBondPage;

  constructor(public page: Page) {
    super(page);
    this.claim = new ClaimPage(page);
    this.addBond = new AddBondPage(page);
    this.unlockBond = new UnlockBondPage(page);
  }
}

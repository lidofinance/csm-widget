import { Page } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { AddBondPage } from './tabs/bondRewards/addBond.page';
import { HubPage } from './tabs/bondRewards/hub.page';
import { ClaimPage } from './tabs/bondRewards/claim.page';

export class BondRewardsPage extends BasePage {
  hub: HubPage;
  claim: ClaimPage;
  addBond: AddBondPage;

  constructor(public page: Page) {
    super(page);
    this.hub = new HubPage(page);
    this.claim = new ClaimPage(page);
    this.addBond = new AddBondPage(page);
  }
}

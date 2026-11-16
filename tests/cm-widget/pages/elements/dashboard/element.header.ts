import { Locator, Page } from '@playwright/test';

export class HeaderCard {
  root: Locator;
  operatorName: Locator;
  operatorTypeTag: Locator;
  operatorAddresses: Locator;
  rewardsAddress: Locator;
  managerAddress: Locator;
  claimerFlag: Locator;
  splittersFlag: Locator;
  settingsLink: Locator;
  operatorGroupLink: Locator;
  operatorNoGroup: Locator;
  descriptorId: Locator;
  operatorDescription: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('dashboardHeaderCard');
    this.operatorName = this.root.getByTestId('operatorName');
    this.operatorTypeTag = this.root.getByTestId('operatorTypeTag');
    this.operatorAddresses = this.root.getByTestId('operatorAddresses');
    this.rewardsAddress = this.root.getByTestId('operatorRewardsAddress');
    this.managerAddress = this.root.getByTestId('operatorManagerAddress');
    this.claimerFlag = this.root.getByTestId('claimerFlag');
    this.splittersFlag = this.root.getByTestId('splittersFlag');
    this.settingsLink = this.root.getByTestId('dashboardSettingsLink');
    this.operatorGroupLink = this.root.getByTestId('operatorGroupLink');
    this.operatorNoGroup = this.root.getByTestId('operatorNoGroup');
    this.descriptorId = this.root.getByTestId('descriptorId');
    this.operatorDescription = this.root.getByTestId('operatorDescription');
  }
}

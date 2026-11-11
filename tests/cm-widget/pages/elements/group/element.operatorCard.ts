import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class OperatorCard extends BasePage {
  root: Locator;

  // Header
  weight: Locator;
  metadataName: Locator;
  curveName: Locator;
  rewardsAddress: Locator;
  managerAddress: Locator;
  keysChip: Locator;

  // Stake columns
  stakeColumnActive: Locator;
  stakeColumnActiveTooltip: Locator;
  stakeColumnActiveKeys: Locator;
  stakeColumnDepositable: Locator;
  stakeColumnDepositableTooltip: Locator;
  stakeColumnDepositableKeys: Locator;
  stakeColumnTsa: Locator;
  stakeColumnTsaTooltip: Locator;
  stakeColumnTsaKeys: Locator;

  // Footer
  keyLimit: Locator;

  // Actions
  goToDashboardBtn: Locator;
  switchToOperatorBtn: Locator;
  currentTag: Locator;

  constructor(page: Page, root: Locator) {
    super(page);
    this.root = root;

    this.weight = this.root.getByTestId('operatorWeight');
    this.metadataName = this.root.getByTestId('operatorMetadataName');
    this.curveName = this.root.getByTestId('operatorCurveName');
    this.rewardsAddress = this.root.getByTestId('operatorRewardsAddress');
    this.managerAddress = this.root.getByTestId('operatorManagerAddress');
    this.keysChip = this.root.getByTestId('moreKeysChip');

    this.stakeColumnActive = this.root.getByTestId('stakeColumnActive');
    this.stakeColumnActiveTooltip =
      this.stakeColumnActive.getByTestId('iconTooltip');
    this.stakeColumnActiveKeys = this.root.getByTestId('stakeColumnActiveKeys');
    this.stakeColumnDepositable = this.root.getByTestId(
      'stakeColumnDepositable',
    );
    this.stakeColumnDepositableTooltip =
      this.stakeColumnDepositable.getByTestId('iconTooltip');
    this.stakeColumnDepositableKeys = this.root.getByTestId(
      'stakeColumnDepositableKeys',
    );
    this.stakeColumnTsa = this.root.getByTestId('stakeColumnTsa');
    this.stakeColumnTsaTooltip = this.stakeColumnTsa.getByTestId('iconTooltip');
    this.stakeColumnTsaKeys = this.root.getByTestId('stakeColumnTsaKeys');

    this.keyLimit = this.root.getByTestId('operatorKeyLimit');

    this.goToDashboardBtn = this.root.getByTestId('goToDashboardBtn');
    this.switchToOperatorBtn = this.root.getByTestId('switchToOperatorBtn');
    this.currentTag = this.root.getByTestId('currentTag');
  }
}

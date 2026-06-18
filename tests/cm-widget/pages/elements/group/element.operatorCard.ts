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
  stakeColumnPotential: Locator;
  stakeColumnPotentialTooltip: Locator;

  // Footer
  keyLimit: Locator;

  // Actions
  uploadKeysLink: Locator;
  switchAndUploadButton: Locator;
  switchOperatorButton: Locator;
  differentWalletMessage: Locator;

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
    this.stakeColumnPotential = this.root.getByTestId('stakeColumnPotential');
    this.stakeColumnPotentialTooltip =
      this.stakeColumnPotential.getByTestId('iconTooltip');

    this.keyLimit = this.root.getByTestId('operatorKeyLimit');

    this.uploadKeysLink = this.root.getByTestId('uploadKeysLink');
    this.switchAndUploadButton = this.root.getByTestId('switchAndUploadButton');
    this.switchOperatorButton = this.root.getByTestId('switchOperatorButton');
    this.differentWalletMessage = this.root.getByTestId(
      'differentWalletMessage',
    );
  }
}

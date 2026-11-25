import { Locator, Page } from '@playwright/test';

export class StakeCard {
  root: Locator;
  link: Locator;
  stakeColumnActive: Locator;
  stakeColumnActiveKeys: Locator;
  stakeColumnActiveInfo: Locator;
  stakeColumnDepositable: Locator;
  stakeColumnDepositableKeys: Locator;
  stakeColumnDepositableInfo: Locator;
  stakeColumnTsa: Locator;
  stakeColumnTsaKeys: Locator;
  stakeColumnTsaInfo: Locator;
  stakeBar: Locator;
  keyLimit: Locator;
  moreKeysChip: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('dashboardKeysSection');
    this.link = this.root.getByTestId('sectionHeaderLink');
    this.stakeColumnActive = this.root.getByTestId('stakeColumnActive');
    this.stakeColumnActiveKeys = this.root.getByTestId('stakeColumnActiveKeys');
    this.stakeColumnActiveInfo =
      this.stakeColumnActive.getByTestId('iconTooltip');
    this.stakeColumnDepositable = this.root.getByTestId(
      'stakeColumnDepositable',
    );
    this.stakeColumnDepositableKeys = this.root.getByTestId(
      'stakeColumnDepositableKeys',
    );
    this.stakeColumnDepositableInfo =
      this.stakeColumnDepositable.getByTestId('iconTooltip');
    this.stakeColumnTsa = this.root.getByTestId('stakeColumnTsa');
    this.stakeColumnTsaKeys = this.root.getByTestId('stakeColumnTsaKeys');
    this.stakeColumnTsaInfo = this.stakeColumnTsa.getByTestId('iconTooltip');
    this.stakeBar = this.root.getByTestId('stakeBar');
    this.keyLimit = this.root.getByTestId('operatorKeyLimit');
    this.moreKeysChip = this.root.getByTestId('moreKeysChip');
  }
}

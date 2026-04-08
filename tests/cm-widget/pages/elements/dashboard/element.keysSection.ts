import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class KeysSection extends BasePage {
  page: Page;

  section: Locator;
  sectionHeaderLink: Locator;

  // Stake & Keys top row
  stakeColumnActive: Locator;
  stakeColumnActiveTooltip: Locator;
  stakeColumnActiveKeys: Locator;
  stakeColumnDepositable: Locator;
  stakeColumnDepositableTooltip: Locator;
  stakeColumnDepositableKeys: Locator;
  stakeColumnPotential: Locator;
  stakeColumnPotentialTooltip: Locator;

  // Keys Breakdown
  keysBreakdown: Locator;
  keysBreakdownToggle: Locator;
  keysDepositableCount: Locator;
  keysPendingActivationCount: Locator;
  keysActiveCount: Locator;
  keysExitedCount: Locator;
  keysWithdrawnCount: Locator;
  keysUnbondedCount: Locator;
  keysExitRequestedCount: Locator;
  keysDuplicatedCount: Locator;
  keysInvalidCount: Locator;
  keysUncheckedCount: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.section = this.page.getByTestId('dashboardKeysSection');
    this.sectionHeaderLink = this.section.getByTestId('sectionHeaderLink');

    this.stakeColumnActive = this.section.getByTestId('stakeColumnActive');
    this.stakeColumnActiveTooltip =
      this.stakeColumnActive.getByTestId('iconTooltip');
    this.stakeColumnActiveKeys = this.section.getByTestId(
      'stakeColumnActiveKeys',
    );
    this.stakeColumnDepositable = this.section.getByTestId(
      'stakeColumnDepositable',
    );
    this.stakeColumnDepositableTooltip =
      this.stakeColumnDepositable.getByTestId('iconTooltip');
    this.stakeColumnDepositableKeys = this.section.getByTestId(
      'stakeColumnDepositableKeys',
    );
    this.stakeColumnPotential = this.section.getByTestId(
      'stakeColumnPotential',
    );
    this.stakeColumnPotentialTooltip =
      this.stakeColumnPotential.getByTestId('iconTooltip');

    this.keysBreakdown = this.section.getByTestId('keysBreakdownBlock');
    this.keysBreakdownToggle = this.keysBreakdown.getByRole('button');
    this.keysDepositableCount = this.section.getByTestId(
      'keysDepositableCount',
    );
    this.keysPendingActivationCount = this.section.getByTestId(
      'keysPendingActivationCount',
    );
    this.keysActiveCount = this.section.getByTestId('keysActiveCount');
    this.keysExitedCount = this.section.getByTestId('keysExitedCount');
    this.keysWithdrawnCount = this.section.getByTestId('keysWithdrawnCount');
    this.keysUnbondedCount = this.section.getByTestId('keysUnbondedCount');
    this.keysExitRequestedCount = this.section.getByTestId(
      'keysExitRequestedCount',
    );
    this.keysDuplicatedCount = this.section.getByTestId('keysDuplicatedCount');
    this.keysInvalidCount = this.section.getByTestId('keysInvalidCount');
    this.keysUncheckedCount = this.section.getByTestId('keysUncheckedCount');
  }

  async expandKeysBreakdown() {
    await test.step('Expand Keys Breakdown section', async () => {
      const isExpanded =
        (await this.keysBreakdownToggle.getAttribute('aria-expanded')) ===
        'true';

      if (isExpanded) return;

      await this.keysBreakdownToggle.click();
      await this.keysDepositableCount.waitFor({ state: 'visible' });
    });
  }
}

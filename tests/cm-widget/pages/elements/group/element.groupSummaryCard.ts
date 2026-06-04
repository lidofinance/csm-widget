import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class GroupSummaryCard extends BasePage {
  root: Locator;
  title: Locator;
  totalWeight: Locator;
  keysChip: Locator;

  // Stake columns
  stakeColumnActive: Locator;
  stakeColumnActiveTooltip: Locator;
  stakeColumnDepositable: Locator;
  stakeColumnDepositableTooltip: Locator;
  stakeColumnPotential: Locator;
  stakeColumnPotentialTooltip: Locator;

  tooltipWrapper: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.page.getByTestId('groupSummaryCard');
    this.title = this.root.getByTestId('groupSummaryTitle');
    this.totalWeight = this.root.getByTestId('groupTotalWeight');
    this.keysChip = this.root.getByTestId('moreKeysChip');

    this.stakeColumnActive = this.root.getByTestId('stakeColumnActive');
    this.stakeColumnActiveTooltip =
      this.stakeColumnActive.getByTestId('iconTooltip');
    this.stakeColumnDepositable = this.root.getByTestId(
      'stakeColumnDepositable',
    );
    this.stakeColumnDepositableTooltip =
      this.stakeColumnDepositable.getByTestId('iconTooltip');
    this.stakeColumnPotential = this.root.getByTestId('stakeColumnPotential');
    this.stakeColumnPotentialTooltip =
      this.stakeColumnPotential.getByTestId('iconTooltip');

    this.tooltipWrapper = this.page.getByTestId('tooltipWrapper');
  }
}

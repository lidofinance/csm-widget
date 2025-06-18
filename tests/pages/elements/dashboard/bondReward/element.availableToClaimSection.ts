import { Locator } from '@playwright/test';
import { BaseExpandedBlock } from './element.baseSection';
import { LOW_TIMEOUT } from 'tests/consts/timeouts';

export class AvailableToClaimBlock extends BaseExpandedBlock {
  rewardsBalance: Locator;
  rewardsBalance_Title: Locator;
  rewardsBalance_TitleIcon: Locator;
  rewardsBalance_Text: Locator;
  rewardsBalance_SubText: Locator;

  excessBondBalance: Locator;
  excessBondBalance_Title: Locator;
  excessBondBalance_TitleIcon: Locator;
  excessBondBalance_Text: Locator;
  excessBondBalance_SubText: Locator;

  constructor(section: Locator) {
    super(section, 'availableToClaimBlock');

    // Rewards Balance
    this.rewardsBalance = this.expandedBlock.getByTestId('rewardsBalance');
    this.rewardsBalance_Title =
      this.rewardsBalance.getByTestId('textTitleContent');
    this.rewardsBalance_TitleIcon =
      this.rewardsBalance_Title.getByTestId('iconTooltip');
    this.rewardsBalance_Text = this.rewardsBalance.getByTestId('textContent');
    this.rewardsBalance_SubText =
      this.rewardsBalance.getByTestId('subtextContent');

    // Excess Bond Balance
    this.excessBondBalance =
      this.expandedBlock.getByTestId('excessBondBalance');
    this.excessBondBalance_Title =
      this.excessBondBalance.getByTestId('textTitleContent');
    this.excessBondBalance_TitleIcon =
      this.excessBondBalance_Title.getByTestId('iconTooltip');
    this.excessBondBalance_Text =
      this.excessBondBalance.getByTestId('textContent');
    this.excessBondBalance_SubText =
      this.excessBondBalance.getByTestId('subtextContent');
  }

  async waitForExpanded(): Promise<void> {
    await this.rewardsBalance.waitFor({
      state: 'visible',
      timeout: LOW_TIMEOUT,
    });
  }
}

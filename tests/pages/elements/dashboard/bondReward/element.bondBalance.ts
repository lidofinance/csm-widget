import { Locator } from '@playwright/test';
import { LOW_TIMEOUT } from 'tests/consts/timeouts';
import { BaseSection } from './element.baseSection';

export class BondBalanceBlock extends BaseSection {
  requiredBondBalance: Locator;
  requiredBondBalance_Title: Locator;
  requiredBondBalance_TitleIcon: Locator;
  requiredBondBalance_Text: Locator;
  requiredBondBalance_SubText: Locator;

  excessBondBalance: Locator;
  excessBondBalance_Title: Locator;
  excessBondBalance_TitleIcon: Locator;
  excessBondBalance_Text: Locator;
  excessBondBalance_SubText: Locator;

  constructor(section: Locator) {
    super(section, 'bondBalanceBlock');

    // Required Balance
    this.requiredBondBalance = this.expandedBlock.getByTestId(
      'requiredBondBalance',
    );
    this.requiredBondBalance_Title =
      this.requiredBondBalance.getByTestId('textTitleContent');
    this.requiredBondBalance_TitleIcon =
      this.requiredBondBalance.getByTestId('iconTooltip');
    this.requiredBondBalance_Text =
      this.requiredBondBalance.getByTestId('textContent');
    this.requiredBondBalance_SubText =
      this.requiredBondBalance.getByTestId('subtextContent');

    // Excess Bond Balance
    this.excessBondBalance =
      this.expandedBlock.getByTestId('excessBondBalance');
    this.excessBondBalance_Title =
      this.excessBondBalance.getByTestId('textTitleContent');
    this.excessBondBalance_TitleIcon =
      this.excessBondBalance.getByTestId('iconTooltip');
    this.excessBondBalance_Text =
      this.excessBondBalance.getByTestId('textContent');
    this.excessBondBalance_SubText =
      this.excessBondBalance.getByTestId('subtextContent');
  }

  async waitForExpanded(): Promise<void> {
    await this.requiredBondBalance.waitFor({
      state: 'visible',
      timeout: LOW_TIMEOUT,
    });
  }
}

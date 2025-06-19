import { Locator } from '@playwright/test';
import { BaseExpandedBlock } from './element.baseSection';
import { LOW_TIMEOUT } from 'tests/consts/timeouts';
import { waitForCallback } from 'tests/helpers/tests';

export class LatestRewardsDistributionBlock extends BaseExpandedBlock {
  rowHeader: Locator;

  // Last rewards information
  lastRewardsInfo: Locator;

  // Next rewards information
  nextRewardsInfo: Locator;
  reportFrame: Locator;
  expectedDays: Locator;

  constructor(section: Locator) {
    super(section, 'lastRewardsBlock');

    this.rowHeader = this.expandedBlock.getByTestId('rowHeader');

    // Last rewards information
    this.lastRewardsInfo = this.expandedBlock.getByTestId('lastRewardsInfo');

    // Next rewards information
    this.nextRewardsInfo = this.expandedBlock.getByTestId('nextRewardsInfo');
    this.reportFrame = this.nextRewardsInfo.getByTestId('reportFrame');
    this.expectedDays = this.nextRewardsInfo.getByTestId('expectedDays');
  }

  async waitForExpanded(): Promise<void> {
    await this.expectedDays.waitFor({
      state: 'visible',
      timeout: LOW_TIMEOUT,
    });

    // sometimes block didnt expand, but all children elements have a boundingBox
    await waitForCallback(
      async (locator: Locator) => {
        const boundingBox = await locator.boundingBox();
        return boundingBox?.height && boundingBox?.height > 88;
      },
      this.expandedBlock,
      LOW_TIMEOUT,
    );
  }
}

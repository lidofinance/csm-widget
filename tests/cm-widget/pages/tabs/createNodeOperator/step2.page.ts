import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class CreateOperatorStep2Page extends BasePage {
  stepTrackText: Locator;
  stepTitle: Locator;
  stepDescription: Locator;
  backButton: Locator;
  continueButton: Locator;

  managerAddressInput: Locator;
  managerAddressContainer: Locator;
  managerAddressError: Locator;
  managerAddressConnectedButton: Locator;
  managerAddressTooltipIcon: Locator;
  managerAddressOwnerChip: Locator;

  rewardAddressInput: Locator;
  rewardAddressContainer: Locator;
  rewardAddressError: Locator;
  rewardAddressConnectedButton: Locator;
  rewardAddressTooltipIcon: Locator;

  constructor(
    page: Page,
    public form: Locator,
  ) {
    super(page);
    this.stepTrackText = this.form.getByTestId('stepTrackText');
    this.stepTitle = this.form.getByTestId('stepTitle');
    this.stepDescription = this.form.getByTestId('stepDescription');
    this.backButton = this.form.getByRole('button', { name: 'Back' });
    this.continueButton = this.form.getByRole('button', { name: 'Continue' });

    this.managerAddressInput = this.form.locator(
      'input[name="managerAddress"]',
    );
    this.managerAddressContainer = this.form.locator(
      'xpath=//input[@name="managerAddress"]/ancestor::label/..',
    );
    this.managerAddressError = this.managerAddressContainer.getByTestId(
      'input-message-error',
    );
    this.managerAddressConnectedButton = this.managerAddressContainer.getByRole(
      'button',
      { name: 'Connected address' },
    );
    this.managerAddressTooltipIcon =
      this.managerAddressContainer.getByTestId('iconTooltip');
    this.managerAddressOwnerChip =
      this.managerAddressContainer.getByTestId('ownerChip');

    this.rewardAddressInput = this.form.locator('input[name="rewardAddress"]');
    this.rewardAddressContainer = this.form.locator(
      'xpath=//input[@name="rewardAddress"]/ancestor::label/..',
    );
    this.rewardAddressError = this.rewardAddressContainer.getByTestId(
      'input-message-error',
    );
    this.rewardAddressConnectedButton = this.rewardAddressContainer.getByRole(
      'button',
      { name: 'Connected address' },
    );
    this.rewardAddressTooltipIcon =
      this.rewardAddressContainer.getByTestId('iconTooltip');
  }

  async fillForm(managerAddress: string, rewardAddress: string) {
    await test.step('Fill step 2 with manager and reward addresses', async () => {
      await this.managerAddressInput.fill(managerAddress);
      await this.rewardAddressInput.fill(rewardAddress);
      await this.continueButton.click();
    });
  }
}

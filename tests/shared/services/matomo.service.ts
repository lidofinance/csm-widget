import { test, Page } from '@playwright/test';
import { type BaseConfig as CMBaseConfig } from 'tests/cm-widget/config/configs/base.config';
import { type BaseConfig as CSMBaseConfig } from 'tests/csm-widget/config/configs/base.config';

// Minimal config shape shared by CSM and CM widget configs
type MatomoConfig = CMBaseConfig | CSMBaseConfig;

const red = (s: string) => `\u001B[31m${s}\u001B[0m`;
const gray = (s: string) => `\u001B[90m${s}\u001B[0m`;

export class MatomoService {
  public page: Page;

  constructor(
    page: Page,
    private config: MatomoConfig,
  ) {
    this.page = page;
  }

  async waitForEvent(
    propertyName: string,
    propertyValue: string,
    timeout?: { timeout: number },
  ): Promise<void> {
    const matomoUrl = this.config.standConfig.matomoUrl;
    const timeoutMs = timeout?.timeout ?? 10_000;

    await test.step(`Wait for Matomo request with ${propertyName}=${propertyValue}`, async (step) => {
      if (this.config.standConfig.standType === 'staging') {
        // Staging environment does not have Matomo tracking enabled, so we skip the check
        step.skip();
      }
      try {
        await this.page.waitForRequest(
          (request) =>
            request.method() === 'POST' &&
            request.url().startsWith(matomoUrl) &&
            decodeURIComponent(request.url()).includes(
              `${propertyName}=${propertyValue}`,
            ),
          { timeout: timeoutMs },
        );
      } catch (e: any) {
        const timeoutMessage = `Timeout ${timeoutMs}ms exceeded.`;

        throw new Error(
          `${red(timeoutMessage)}\n` +
            `${gray('────────────────────────────────────────')}\n` +
            `Expected POST request to: ${matomoUrl}\n` +
            `With query param:  ${propertyName}=${propertyValue}\n` +
            `${gray('────────────────────────────────────────')}\n` +
            `${gray('Hint: check that the action actually triggers Matomo tracking')}`,
        );
      }
    });
  }
}

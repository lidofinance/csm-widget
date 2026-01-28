import { test, Page } from '@playwright/test';
import { IConfig } from 'tests/config/configs/base.config';

const red = (s: string) => `\u001B[31m${s}\u001B[0m`;
const gray = (s: string) => `\u001B[90m${s}\u001B[0m`;

export class MatomoService {
  public page: Page;

  constructor(
    page: Page,
    private config: IConfig,
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

    await test.step(`Wait for Matomo request with ${propertyName}=${propertyValue}`, async () => {
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

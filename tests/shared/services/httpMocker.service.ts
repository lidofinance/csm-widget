import { Page, test } from '@playwright/test';

type IConfig = {
  urls: {
    csmSurveysApi: string;
  };
};

export class HttpMockerService {
  constructor(
    private page: Page,
    private config: IConfig,
  ) {}

  async mockIcsApply(response: Record<string, any>) {
    const mockUrl = `${this.config.urls.csmSurveysApi}/ics/apply`;
    await test.step('Mock ICS Apply request', async () => {
      await this.page.route(mockUrl, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(response),
        });
      });
    });
  }

  async mockIcsStatus(response: Record<string, any>) {
    const mockUrl = `${this.config.urls.csmSurveysApi}/ics/status`;

    await test.step('Mock ICS Status request', async () => {
      await this.page.route(mockUrl, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(response),
        });
      });
    });
  }
}

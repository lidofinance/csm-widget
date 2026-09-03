import { expect, Locator, Page, test } from '@playwright/test';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';

export const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Anchored pattern for a full URL. Only a trailing slash is tolerated — some
 * targets (docs.lido.fi) redirect `/page` to `/page/`.
 */
export const fullUrlPattern = (url: string) =>
  new RegExp(`^${escapeRegex(url)}/?$`, 'i');

export const fullUrlWithAnchorPattern = (url: string, anchor: string) =>
  new RegExp(`^${escapeRegex(url)}/?${escapeRegex(anchor)}$`, 'i');

/**
 * Anchored pattern for an opened beaconcha.in dashboard: the `?validators=`
 * query form is redirected to a saved dashboard, so both shapes are accepted.
 */
export const beaconchainDashboardPattern = (baseUrl: string) =>
  new RegExp(
    `^${escapeRegex(baseUrl.replace(/\/+$/, ''))}/dashboard(?:\\?validators=[^#]*|/[A-Za-z0-9]+(?:\\?validators=[^#]*)?#summary)$`,
    'i',
  );

type MatomoLinkCase = {
  name: string;
  link: Locator;
  /** Expected value of the Matomo `e_n` query param */
  event: string;
  url: RegExp;
};

/**
 * Click a link that opens a new tab: asserts the Matomo event, the URL of the
 * opened page, and closes it so the next check can wait for its own tab.
 */
export const checkExternalMatomoLink = async (
  page: Page,
  matomo: MatomoService,
  { name, link, event, url }: MatomoLinkCase,
) => {
  await test.step(`"${name}" opens the target page and sends a Matomo event`, async () => {
    const [openedPage] = await Promise.all([
      page.context().waitForEvent('page', { timeout: PAGE_WAIT_TIMEOUT }),
      matomo.waitForEvent('e_n', event),
      link.click(),
    ]);

    await openedPage.waitForLoadState('load');
    await expect(openedPage).toHaveURL(url);
    await openedPage.close();
  });
};

export const checkInternalMatomoLink = async (
  page: Page,
  matomo: MatomoService,
  { name, link, event, url }: MatomoLinkCase,
) => {
  await test.step(`"${name}" navigates inside the widget and sends a Matomo event`, async () => {
    await Promise.all([matomo.waitForEvent('e_n', event), link.click()]);

    await expect(page).toHaveURL(url);
  });
};

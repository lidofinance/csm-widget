import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { widgetFullConfig } from 'tests/cm-widget/config';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

const { chainId } = widgetFullConfig.standConfig.networkConfig;
const UNSUPPORTED_CHAIN_ID = 1337;
const CL_VALIDATORS_URL = `/api/cl/${chainId}/eth/v1/beacon/states/head/validators`;
const CL_CACHE_CONTROL =
  'public, max-age=30, stale-if-error=1200, stale-while-revalidate=30';

test.describe(
  ...suite({
    epic: EPIC.common,
    story: 'BFF CL API proxy',
    tag: [Tags.smoke, Tags.webSecurity],
  }),
  () => {
    test(qase(515, 'Should proxy validators lookup'), async ({ request }) => {
      await test.step('GET returns validator with shared cache', async () => {
        const resp = await request.get(`${CL_VALIDATORS_URL}?id=0`);
        expect(resp.status()).toBe(200);
        expect(resp.headers()['cache-control']).toBe(CL_CACHE_CONTROL);
        const { data } = await resp.json();
        expect(data).toHaveLength(1);
        expect(data[0].index).toBe('0');
      });

      await test.step('POST returns validator without cache', async () => {
        const resp = await request.post(CL_VALIDATORS_URL, {
          data: { ids: ['0'] },
        });
        expect(resp.status()).toBe(200);
        expect(resp.headers()['cache-control']).toContain('no-store');
        const { data } = await resp.json();
        expect(data).toHaveLength(1);
        expect(data[0].index).toBe('0');
      });
    });

    test(
      qase(516, 'Should reject disallowed HTTP method and chain'),
      async ({ request }) => {
        await test.step('PUT is refused with Allow: GET, POST', async () => {
          const resp = await request.put(CL_VALIDATORS_URL);
          expect(resp.status()).toBe(405);
          expect(resp.headers()['allow']).toBe('GET, POST');
        });

        await test.step('Unsupported chainId is refused', async () => {
          const resp = await request.get(
            `/api/cl/${UNSUPPORTED_CHAIN_ID}/eth/v1/beacon/states/head/validators`,
          );
          expect(resp.status()).toBe(400);
          expect((await resp.json()).message).toBe('Unsupported chainId');
        });
      },
    );

    test(
      qase(517, 'Should reject paths outside allowlist'),
      async ({ request }) => {
        for (const [name, method] of [
          ['Other beacon endpoint', 'eth/v1/node/identity'],
          [
            'Path traversal',
            'eth/v1/beacon/states/head/validators/..%2F..%2F..%2F..%2Fnode%2Fidentity',
          ],
          ['Absolute URL', 'https:%2F%2Fexample.com'],
        ]) {
          await test.step(`${name} is refused`, async () => {
            const resp = await request.get(`/api/cl/${chainId}/${method}`);
            expect(resp.ok()).toBe(false);
            expect(resp.headers()['cache-control']).toContain('no-store');
            expect((await resp.json()).message).toMatch(
              /^Api method .+ isn't allowed$/,
            );
          });
        }
      },
    );

    test(qase(518, 'Should reject empty POST body'), async ({ request }) => {
      await test.step('Empty body is refused', async () => {
        const resp = await request.post(CL_VALIDATORS_URL);
        expect(resp.status()).toBe(400);
        expect((await resp.json()).message).toBe('Request body is required');
      });
    });
  },
);

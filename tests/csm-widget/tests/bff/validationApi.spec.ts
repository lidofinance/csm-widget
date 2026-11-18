import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

const VALIDATION_URL = '/api/validation';
const ADDRESS = '0x000000000000000000000000000000000000dEaD';

test.describe(
  ...suite({
    epic: EPIC.common,
    story: 'BFF Validation API',
    tag: [Tags.smoke, Tags.webSecurity],
  }),
  () => {
    test('Should answer address check with CORS and no-store', async ({
      request,
    }) => {
      await test.step('GET returns validity of the address', async () => {
        const resp = await request.get(`${VALIDATION_URL}?address=${ADDRESS}`);
        expect(resp.status()).toBe(200);
        expect(typeof (await resp.json()).isValid).toBe('boolean');

        const headers = resp.headers();
        expect(headers['cache-control']).toContain('no-store');
        expect(headers['access-control-allow-origin']).toBe('*');
        expect(headers['access-control-allow-methods']).toBe('GET');
      });
    });

    test('Should reject non-GET requests', async ({ request }) => {
      await test.step('POST is refused with Allow: GET', async () => {
        const resp = await request.post(`${VALIDATION_URL}?address=${ADDRESS}`);
        expect(resp.status()).toBe(405);
        expect(resp.headers()['allow']).toBe('GET');
      });
    });
  },
);

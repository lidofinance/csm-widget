import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { widgetFullConfig } from 'tests/csm-widget/config';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

const { chainId } = widgetFullConfig.standConfig.networkConfig;
const FOREIGN_ORIGIN = 'https://evil.example';
const CL_VALIDATORS_URL = `/api/cl/${chainId}/eth/v1/beacon/states/head/validators`;

const HIDDEN_PATHS = [
  '/.env',
  '/.git/HEAD',
  '/package.json',
  '/server.mjs',
  '/next.config.mjs',
  '/api/metrics',
];

test.describe(
  ...suite({
    epic: EPIC.security,
    story: 'Exposure',
    tag: Tags.webSecurity,
  }),
  () => {
    HIDDEN_PATHS.forEach((path) => {
      test(`Should not expose ${path}`, async ({ request }) => {
        await test.step(`GET ${path} returns 404`, async () => {
          const resp = await request.get(path);
          expect(resp.status()).toBe(404);
        });
      });
    });

    test('Should not leak server config into runtime env', async ({
      request,
    }) => {
      await test.step('window-env.js has no RPC, CL or secret keys', async () => {
        const resp = await request.get('/runtime/window-env.js');
        expect(resp.status()).toBe(200);
        expect(resp.headers()['x-content-type-options']).toBe('nosniff');

        const body = await resp.text();
        const env = JSON.parse(
          body.slice(body.indexOf('{'), body.lastIndexOf('}') + 1),
        );
        expect(
          Object.keys(env).filter((key) =>
            /rpc|^cl|secret|token|password|apikey/i.test(key),
          ),
        ).toEqual([]);
      });
    });

    test('Should not allow cross-origin RPC requests', async ({ request }) => {
      await test.step('Preflight is refused', async () => {
        const resp = await request.fetch(`/api/rpc?chainId=${chainId}`, {
          method: 'OPTIONS',
          headers: {
            Origin: FOREIGN_ORIGIN,
            'Access-Control-Request-Method': 'POST',
          },
        });
        expect(resp.ok()).toBe(false);
        expect(resp.headers()['access-control-allow-origin']).toBeUndefined();
      });

      await test.step('POST gets no CORS header', async () => {
        const resp = await request.post(`/api/rpc?chainId=${chainId}`, {
          headers: { Origin: FOREIGN_ORIGIN },
          data: { jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] },
        });
        expect(resp.headers()['access-control-allow-origin']).toBeUndefined();
      });
    });

    test('Should not allow cross-origin CL requests', async ({ request }) => {
      await test.step('GET gets no CORS header', async () => {
        const resp = await request.get(`${CL_VALIDATORS_URL}?id=0`, {
          headers: { Origin: FOREIGN_ORIGIN },
        });
        expect(resp.headers()['access-control-allow-origin']).toBeUndefined();
      });
    });
  },
);

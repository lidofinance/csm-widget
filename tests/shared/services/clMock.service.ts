import { BrowserContext, Route } from '@playwright/test';
import {
  buildClResponse,
  ClKeyStatus,
  ClResponse,
  ClStates,
} from 'tests/shared/helpers/clMockResponse';

// The widget's own CL proxy: `/api/cl/<chainId>/eth/v1/beacon/states/head/validators`
const CL_VALIDATORS =
  /\/api\/cl\/\d+\/eth\/v1\/beacon\/states\/head\/validators/;

/**
 * Answers the widget's CL requests for the pubkeys it was given; the rest go
 * to the real CL. The SDK caches CL responses: reload the page after `set`.
 */
export class ClMockService {
  private states: ClStates = {};

  async install(context: BrowserContext): Promise<void> {
    await context.route(CL_VALIDATORS, (route) => this.handle(route));
  }

  set(pubkeys: string | string[], status: ClKeyStatus): void {
    for (const pubkey of [pubkeys].flat()) {
      this.states[pubkey.toLowerCase()] = status;
    }
  }

  reset(): void {
    this.states = {};
  }

  // The SDK posts `{ ids }` first and only falls back to GET when that fails
  private async handle(route: Route): Promise<void> {
    const ids: string[] = route.request().postDataJSON()?.ids ?? [];
    if (!ids.some((id) => id.toLowerCase() in this.states)) {
      return route.fallback();
    }

    const real = await route
      .fetch()
      .then((response) => (response.ok() ? response.json() : undefined))
      .catch(() => undefined);

    await route.fulfill({
      json: buildClResponse(this.states, ids, real as ClResponse | undefined),
    });
  }
}

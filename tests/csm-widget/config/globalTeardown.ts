import { stopForkNode } from 'tests/shared/services/forkNode.service';
import { stopMocks } from 'tests/shared/services/mocks.lifecycle';

export default async function globalTeardown() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }
  if (process.env.CI) {
    await stopForkNode();
  }
  await stopMocks();
}

import { stopForkNode } from 'tests/shared/services/forkNode.service';

export default async function globalTeardown() {
  if (process.env.CI) {
    await stopForkNode();
  }
}

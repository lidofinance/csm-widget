import { execSync } from 'node:child_process';
import { IpfsNodeService } from 'tests/shared/services/ipfsNode.service';

export default async function globalTeardown() {
  if (process.env.CI) {
    await new IpfsNodeService().stop();
  } else {
    console.info(
      `[globalTeardown] You are using local IPFS node, make sure you have it stopped if you don't need it.`,
    );
  }

  if (!process.env.CI) {
    return;
  }

  try {
    execSync('/usr/bin/pkill -x anvil', { stdio: 'pipe' });
    console.info('[teardown] anvil stopped');
  } catch (e: any) {
    console.info('[teardown] pkill exit code:', e.status, e.message);
  }
}

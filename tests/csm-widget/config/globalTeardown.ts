import { execSync } from 'node:child_process';

export default async function globalTeardown() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  try {
    execSync('/usr/bin/pkill -x anvil', { stdio: 'pipe' });
    console.info('[teardown] anvil stopped');
  } catch (e: any) {
    console.info('[teardown] pkill exit code:', e.status, e.message);
  }
}

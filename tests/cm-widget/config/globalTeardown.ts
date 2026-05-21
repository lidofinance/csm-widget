import { execFileSync } from 'node:child_process';
import { widgetFullConfig } from '.';

const forceStopNode = (port: number) => {
  let pids: number[];
  try {
    pids = execFileSync('lsof', ['-ti', `:${port}`])
      .toString()
      .trim()
      .split('\n')
      .map(Number)
      .filter(Boolean);
  } catch (e: any) {
    if (e.status === 1) return;
    console.error(`Failed to list processes on port ${port}:`, e);
    throw new Error(`Failed to list processes on port ${port}: ${e}`);
  }
  if (pids.length === 0) return;
  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch (e) {
      console.error(`Failed to kill process ${pid} on port ${port}:`, e);
      throw new Error(`Failed to kill process ${pid} on port ${port}: ${e}`);
    }
  }
  console.info(`Successfully killed process on port ${port}`);
};

export default async function globalTeardown() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  forceStopNode(widgetFullConfig.standConfig.nodeConfig.port as number);
}

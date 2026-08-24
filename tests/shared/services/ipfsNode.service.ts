import { spawn, execFileSync, ChildProcess } from 'child_process';
import { rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

const GATEWAY_PORT = 8080;
const API_PORT = 5001;
// fixed path so that globalTeardown can clean up without shared state
const REPO_PATH = path.join(tmpdir(), 'ipfs-e2e-repo');

const log = (msg: string) => console.info(`[ipfs] ${msg}`);

export class IpfsNodeService {
  private daemon: ChildProcess | null = null;
  private daemonOutput = '';

  async start(): Promise<void> {
    const startMs = Date.now();
    log(`repo ${REPO_PATH}`);
    log(`gateway :${GATEWAY_PORT}  api :${API_PORT}`);

    this.init();

    this.daemon = spawn('ipfs', ['daemon'], {
      env: { ...process.env, IPFS_PATH: REPO_PATH },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    this.daemon.stdout?.on('data', (chunk) => this.collect(chunk));
    this.daemon.stderr?.on('data', (chunk) => this.collect(chunk));
    this.daemon.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`[ipfs] daemon exited with code ${code}`);
      }
    });
    log(`daemon spawned, pid ${this.daemon.pid}`);

    await this.waitUntilReady();
    log(`ready in ${Date.now() - startMs}ms`);
  }

  async stop(): Promise<void> {
    try {
      this.ipfs(['--api', `/ip4/127.0.0.1/tcp/${API_PORT}`, 'shutdown']);
      log('daemon shut down');
    } catch (err) {
      log(`shutdown failed: ${(err as Error).message.split('\n')[0]}`);
      this.daemon?.kill('SIGTERM');
    }
    this.daemon = null;

    if (existsSync(REPO_PATH)) {
      rmSync(REPO_PATH, { recursive: true, force: true });
      log('repo removed');
    }
  }

  private collect(chunk: Buffer): void {
    this.daemonOutput = (this.daemonOutput + chunk.toString()).slice(-4000);
  }

  private init(): void {
    if (existsSync(REPO_PATH)) {
      rmSync(REPO_PATH, { recursive: true, force: true });
      log('stale repo removed');
    }
    this.ipfs(['init', '--profile=server']);
    log('repo initialised');
  }

  private ipfs(args: string[]): string {
    return execFileSync('ipfs', args, {
      encoding: 'utf-8',
      env: { ...process.env, IPFS_PATH: REPO_PATH },
      stdio: 'pipe',
    });
  }

  private async waitUntilReady(timeoutMs = 60_000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    let attempt = 0;
    while (Date.now() < deadline) {
      attempt += 1;
      try {
        this.ipfs(['--api', `/ip4/127.0.0.1/tcp/${API_PORT}`, 'id']);
        return;
      } catch {
        if (attempt % 10 === 0) log(`waiting for daemon, attempt ${attempt}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    console.error(`[ipfs] daemon output:\n${this.daemonOutput.trimEnd()}`);
    throw new Error(`IPFS daemon did not become ready in ${timeoutMs}ms`);
  }
}

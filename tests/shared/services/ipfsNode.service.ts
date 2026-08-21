import { spawn, execFileSync, ChildProcess } from 'child_process';
import { rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

export type IpfsNodeOptions = {
  gatewayPort?: number;
  apiPort?: number;
  allowedOrigin?: string;
};

const log = (msg: string) => console.info(`[ipfs] ${msg}`);

export class IpfsNodeService {
  private daemon: ChildProcess | null = null;
  private daemonOutput = '';
  private readonly repoPath: string;
  private readonly gatewayPort: number;
  private readonly apiPort: number;
  private readonly allowedOrigin: string;

  constructor(options: IpfsNodeOptions = {}) {
    this.gatewayPort = options.gatewayPort ?? 8080;
    this.apiPort = options.apiPort ?? 5001;
    this.allowedOrigin = options.allowedOrigin ?? 'http://localhost:3000';
    // fixed path so that globalTeardown can clean up without shared state
    this.repoPath = path.join(tmpdir(), 'ipfs-e2e-repo');
  }

  get gatewayUrl(): string {
    return `http://127.0.0.1:${this.gatewayPort}/ipfs/{cid}`;
  }

  async start(): Promise<void> {
    const startMs = Date.now();
    log(`repo ${this.repoPath}`);
    log(`gateway :${this.gatewayPort}  api :${this.apiPort}`);

    this.init();

    this.daemon = spawn('ipfs', ['daemon', '--enable-gc=false'], {
      env: { ...process.env, IPFS_PATH: this.repoPath },
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
      this.ipfs(['--api', `/ip4/127.0.0.1/tcp/${this.apiPort}`, 'shutdown']);
      log('daemon shut down');
    } catch (err) {
      log(`shutdown failed: ${(err as Error).message.split('\n')[0]}`);
      this.daemon?.kill('SIGTERM');
    }
    this.daemon = null;

    if (existsSync(this.repoPath)) {
      rmSync(this.repoPath, { recursive: true, force: true });
      log('repo removed');
    }
  }

  private collect(chunk: Buffer): void {
    this.daemonOutput = (this.daemonOutput + chunk.toString()).slice(-4000);
  }

  private init(): void {
    if (existsSync(this.repoPath)) {
      rmSync(this.repoPath, { recursive: true, force: true });
      log('stale repo removed');
    }
    this.ipfs(['init', '--profile=server']);

    this.ipfs([
      'config',
      'Addresses.Gateway',
      `/ip4/127.0.0.1/tcp/${this.gatewayPort}`,
    ]);
    this.ipfs([
      'config',
      'Addresses.API',
      `/ip4/127.0.0.1/tcp/${this.apiPort}`,
    ]);
    // CORS defaults differ between Kubo releases, so set them explicitly
    const origins = JSON.stringify([this.allowedOrigin]);
    this.ipfs([
      'config',
      '--json',
      'Gateway.HTTPHeaders.Access-Control-Allow-Origin',
      origins,
    ]);
    this.ipfs([
      'config',
      '--json',
      'API.HTTPHeaders.Access-Control-Allow-Origin',
      origins,
    ]);
    log(`repo initialised, CORS origin ${this.allowedOrigin}`);
  }

  private ipfs(args: string[]): string {
    return execFileSync('ipfs', args, {
      encoding: 'utf-8',
      env: { ...process.env, IPFS_PATH: this.repoPath },
      stdio: 'pipe',
    });
  }

  private async waitUntilReady(timeoutMs = 60_000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    let attempt = 0;
    while (Date.now() < deadline) {
      attempt += 1;
      try {
        this.ipfs(['--api', `/ip4/127.0.0.1/tcp/${this.apiPort}`, 'id']);
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

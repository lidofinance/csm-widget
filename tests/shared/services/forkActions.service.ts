import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export interface ForkActionsOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  chain?: string;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  code: number | null;
}

export class ForkActionsService {
  private cwd?: string;
  private readonly baseEnv: NodeJS.ProcessEnv;
  private readonly chain?: string;

  constructor(options: ForkActionsOptions = {}) {
    this.cwd = options.cwd;
    this.baseEnv = { ...process.env, ...options.env };
    this.chain = options.chain;
    this.assertReady();
  }

  private assertReady() {
    if (!this.cwd) return;
    const hasJustfile = existsSync(join(this.cwd, 'Justfile'));
    const hasForkJust = existsSync(join(this.cwd, 'fork.just'));
    if (!hasJustfile && !hasForkJust) {
      // Soft warning via stderr (avoid throwing to keep flexibility)
      // eslint-disable-next-line no-console
      console.warn(
        '[ForkActionsService] Warning: Neither Justfile nor fork.just found in',
        this.cwd,
      );
    }
  }

  run(recipe: string, ...args: string[]): Promise<RunResult> {
    return this.execJust([recipe, ...args]);
  }

  // ---- Recipe wrappers (simple pass-throughs) ----
  proposeManager(noId: number, address: string) {
    return this.run('propose-manager', String(noId), address);
  }
  proposeReward(noId: number, address: string) {
    return this.run('propose-reward', String(noId), address);
  }
  confirmManager(noId: number) {
    return this.run('confirm-manager', String(noId));
  }
  confirmReward(noId: number) {
    return this.run('confirm-reward', String(noId));
  }
  addKeys(noId: number, keysCount: number) {
    return this.run('add-keys', String(noId), String(keysCount));
  }
  unvetKeys(noId: number, vettedKeysCount: number) {
    return this.run('unvet-keys', String(noId), String(vettedKeysCount));
  }
  exitKeys(noId: number, exitedKeysCount: number) {
    return this.run('exit-keys', String(noId), String(exitedKeysCount));
  }
  stuckKeys(noId: number, stuckKeysCount: number) {
    return this.run('stuck-keys', String(noId), String(stuckKeysCount));
  }
  withdrawKey(
    noId: number,
    keyIndex: number,
    exitBalance = '32000000000000000000',
    slashingPenalty = '0',
  ) {
    return this.run(
      'withdraw-key',
      String(noId),
      String(keyIndex),
      exitBalance,
      slashingPenalty,
    );
  }
  slashKey(noId: number, keyIndex: number) {
    return this.run('slash-key', String(noId), String(keyIndex));
  }
  removeKey(noId: number, keyIndex: number) {
    return this.run('remove-key', String(noId), String(keyIndex));
  }
  depositKeys(depositsCount: number) {
    return this.run('deposit-keys', String(depositsCount));
  }
  targetLimit(noId: number, limit: number) {
    return this.run('target-limit', String(noId), String(limit));
  }
  targetLimitForced(noId: number, limit: number) {
    return this.run('target-limit-forced', String(noId), String(limit));
  }
  targetLimitOff(noId: number) {
    return this.run('target-limit-off', String(noId));
  }
  reportStealing(noId: number, amount: string | number) {
    return this.run('report-stealing', String(noId), String(amount));
  }
  cancelStealing(noId: number, amount: string | number) {
    return this.run('cancel-stealing', String(noId), String(amount));
  }
  settleStealing(noId: number) {
    return this.run('settle-stealing', String(noId));
  }
  compensateStealing(noId: number, amount: string | number) {
    return this.run('compensate-stealing', String(noId), String(amount));
  }
  exitRequest(
    noId: number,
    validatorIndex: number,
    validatorPubKeyHex: string,
  ) {
    return this.run(
      'exit-request',
      String(noId),
      String(validatorIndex),
      validatorPubKeyHex,
    );
  }
  voteAddModule() {
    return this.run('vote-add-module');
  }
  voteUpgrade() {
    return this.run('vote-upgrade');
  }
  publicRelease() {
    return this.run('public-release');
  }
  pauseCsm() {
    return this.run('pause-csm');
  }
  resumeCsm() {
    return this.run('resume-csm');
  }
  pauseAccounting() {
    return this.run('pause-accounting');
  }
  resumeAccounting() {
    return this.run('resume-accounting');
  }

  getCurveInfo(id: number) {
    return this.run('get-curve-info', String(id));
  }

  private execJust(args: string[]): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      execFile('just', args, { cwd: this.cwd, env: this.baseEnv }, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout: '', stderr: '', code: 0 });
      });
    });
  }
}

export default ForkActionsService;

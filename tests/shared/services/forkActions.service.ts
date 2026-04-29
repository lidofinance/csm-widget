import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { test } from '@playwright/test';

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
    return test.step(`[Fork] Propose manager for NO #${noId} to ${address}`, () =>
      this.run('propose-manager', String(noId), address));
  }
  proposeReward(noId: number, address: string) {
    return test.step(`[Fork] Propose reward address for NO #${noId} to ${address}`, () =>
      this.run('propose-reward', String(noId), address));
  }
  confirmManager(noId: number) {
    return test.step(`[Fork] Confirm manager for NO #${noId}`, () =>
      this.run('confirm-manager', String(noId)));
  }
  confirmReward(noId: number) {
    return test.step(`[Fork] Confirm reward address for NO #${noId}`, () =>
      this.run('confirm-reward', String(noId)));
  }
  addKeys(noId: number, keysCount: number) {
    return test.step(`[Fork] Add ${keysCount} key(s) for NO #${noId}`, () =>
      this.run('add-keys', String(noId), String(keysCount)));
  }
  unvetKeys(noId: number, vettedKeysCount: number) {
    return test.step(`[Fork] Unvet keys for NO #${noId} (vetted: ${vettedKeysCount})`, () =>
      this.run('unvet-keys', String(noId), String(vettedKeysCount)));
  }
  exitKeys(noId: number, exitedKeysCount: number) {
    return test.step(`[Fork] Exit ${exitedKeysCount} key(s) for NO #${noId}`, () =>
      this.run('exit-keys', String(noId), String(exitedKeysCount)));
  }
  stuckKeys(noId: number, stuckKeysCount: number) {
    return test.step(`[Fork] Stuck ${stuckKeysCount} key(s) for NO #${noId}`, () =>
      this.run('stuck-keys', String(noId), String(stuckKeysCount)));
  }
  withdrawKey(
    noId: number,
    keyIndex: number,
    exitBalance = '32000000000000000000',
    slashingPenalty = '0',
  ) {
    return test.step(`[Fork] Withdraw key #${keyIndex} for NO #${noId}`, () =>
      this.run(
        'withdraw-key',
        String(noId),
        String(keyIndex),
        exitBalance,
        slashingPenalty,
      ));
  }
  slashKey(noId: number, keyIndex: number) {
    return test.step(`[Fork] Slash key #${keyIndex} for NO #${noId}`, () =>
      this.run('slash-key', String(noId), String(keyIndex)));
  }
  removeKey(noId: number, keyIndex: number) {
    return test.step(`[Fork] Remove key #${keyIndex} for NO #${noId}`, () =>
      this.run('remove-key', String(noId), String(keyIndex)));
  }
  depositKeys(depositsCount: number) {
    return test.step(`[Fork] Deposit ${depositsCount} key(s)`, () =>
      this.run('deposit-keys', String(depositsCount)));
  }
  targetLimit(noId: number, limit: number) {
    return test.step(`[Fork] Set target limit ${limit} for NO #${noId}`, () =>
      this.run('target-limit', String(noId), String(limit)));
  }
  targetLimitForced(noId: number, limit: number) {
    return test.step(`[Fork] Set forced target limit ${limit} for NO #${noId}`, () =>
      this.run('target-limit-forced', String(noId), String(limit)));
  }
  targetLimitOff(noId: number) {
    return test.step(`[Fork] Turn off target limit for NO #${noId}`, () =>
      this.run('target-limit-off', String(noId)));
  }
  reportStealing(noId: number, amount: string | number) {
    return test.step(`[Fork] Report stealing for NO #${noId} (amount: ${amount})`, () =>
      this.run('report-stealing', String(noId), String(amount)));
  }
  cancelStealing(noId: number, amount: string | number) {
    return test.step(`[Fork] Cancel stealing for NO #${noId} (amount: ${amount})`, () =>
      this.run('cancel-stealing', String(noId), String(amount)));
  }
  settleStealing(noId: number) {
    return test.step(`[Fork] Settle stealing for NO #${noId}`, () =>
      this.run('settle-stealing', String(noId)));
  }
  compensateStealing(noId: number, amount: string | number) {
    return test.step(`[Fork] Compensate stealing for NO #${noId} (amount: ${amount})`, () =>
      this.run('compensate-stealing', String(noId), String(amount)));
  }
  exitRequest(
    noId: number,
    validatorIndex: number,
    validatorPubKeyHex: string,
  ) {
    return test.step(`[Fork] Exit request for NO #${noId}, validator #${validatorIndex}`, () =>
      this.run(
        'exit-request',
        String(noId),
        String(validatorIndex),
        validatorPubKeyHex,
      ));
  }
  voteAddModule() {
    return test.step('[Fork] Vote add module', () =>
      this.run('vote-add-module'));
  }
  voteUpgrade() {
    return test.step('[Fork] Vote upgrade', () => this.run('vote-upgrade'));
  }
  publicRelease() {
    return test.step('[Fork] Public release', () => this.run('public-release'));
  }
  pauseCsm() {
    return test.step('[Fork] Pause CSM', () => this.run('pause-csm'));
  }
  resumeCsm() {
    return test.step('[Fork] Resume CSM', () => this.run('resume-csm'));
  }
  pauseAccounting() {
    return test.step('[Fork] Pause accounting', () =>
      this.run('pause-accounting'));
  }
  resumeAccounting() {
    return test.step('[Fork] Resume accounting', () =>
      this.run('resume-accounting'));
  }

  createOperatorGroup(operators: Array<{ id: number; weight: number }>) {
    return test.step(`[Fork] Create operator group (${operators.length} operators)`, () => {
      const args = operators.flatMap(({ id, weight }) => [
        String(id),
        String(weight),
      ]);
      return this.run('create-operator-group', ...args);
    });
  }

  getCurveInfo(id: number) {
    return test.step(`[Fork] Get curve info #${id}`, () =>
      this.run('get-curve-info', String(id)));
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

import { type PostStep, runPostSteps } from './run-post-steps';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const passing = () => vi.fn().mockResolvedValue(undefined);

const failingOnce = (error: Error) =>
  vi.fn().mockRejectedValueOnce(error).mockResolvedValue(undefined);

describe('runPostSteps', () => {
  it('resolves true without steps and leaves the retry callback alone', async () => {
    const onRetryDone = vi.fn();

    await expect(runPostSteps([], onRetryDone)).resolves.toBe(true);
    expect(onRetryDone).not.toHaveBeenCalled();
  });

  it('runs the steps in order and resolves true', async () => {
    const calls: string[] = [];
    const steps: PostStep[] = ['upload', 'init'].map((name) => ({
      run: vi.fn(() => {
        calls.push(name);
        return Promise.resolve();
      }),
      onFail: vi.fn(),
    }));

    await expect(runPostSteps(steps, vi.fn())).resolves.toBe(true);
    expect(calls).toEqual(['upload', 'init']);
  });

  it('stops at a failed step and hands it the error and a retry', async () => {
    const error = new Error('upload failed');
    const uploadFail = vi.fn<(error: unknown, retry: () => void) => void>();
    const initRun = passing();

    const done = await runPostSteps(
      [
        { run: vi.fn().mockRejectedValue(error), onFail: uploadFail },
        { run: initRun, onFail: vi.fn() },
      ],
      vi.fn(),
    );

    expect(done).toBe(false);
    expect(uploadFail).toHaveBeenCalledWith(error, expect.any(Function));
    expect(initRun).not.toHaveBeenCalled();
  });

  it('resumes from the failed step on retry and closes once the rest pass', async () => {
    const onRetryDone = vi.fn();
    const uploadRun = failingOnce(new Error('upload failed'));
    const uploadFail = vi.fn<(error: unknown, retry: () => void) => void>();
    const initRun = passing();

    await runPostSteps(
      [
        { run: uploadRun, onFail: uploadFail },
        { run: initRun, onFail: vi.fn() },
      ],
      onRetryDone,
    );
    expect(onRetryDone).not.toHaveBeenCalled();

    uploadFail.mock.calls[0][1]();
    await flush();

    expect(uploadRun).toHaveBeenCalledTimes(2);
    expect(initRun).toHaveBeenCalledTimes(1);
    expect(onRetryDone).toHaveBeenCalledTimes(1);
  });

  it('retries only the failed later step', async () => {
    const onRetryDone = vi.fn();
    const uploadRun = passing();
    const initRun = failingOnce(new Error('init failed'));
    const initFail = vi.fn<(error: unknown, retry: () => void) => void>();

    await expect(
      runPostSteps(
        [
          { run: uploadRun, onFail: vi.fn() },
          { run: initRun, onFail: initFail },
        ],
        onRetryDone,
      ),
    ).resolves.toBe(false);

    initFail.mock.calls[0][1]();
    await flush();

    expect(uploadRun).toHaveBeenCalledTimes(1);
    expect(initRun).toHaveBeenCalledTimes(2);
    expect(onRetryDone).toHaveBeenCalledTimes(1);
  });

  it('hands out a fresh retry when the retry fails again', async () => {
    const onRetryDone = vi.fn();
    const uploadRun = vi
      .fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockRejectedValueOnce(new Error('second'))
      .mockResolvedValue(undefined);
    const uploadFail = vi.fn<(error: unknown, retry: () => void) => void>();

    await runPostSteps([{ run: uploadRun, onFail: uploadFail }], onRetryDone);

    uploadFail.mock.calls[0][1]();
    await flush();
    expect(uploadFail).toHaveBeenCalledTimes(2);
    expect(onRetryDone).not.toHaveBeenCalled();

    uploadFail.mock.calls[1][1]();
    await flush();
    expect(onRetryDone).toHaveBeenCalledTimes(1);
  });
});

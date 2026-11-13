export type PostStep = {
  run: () => Promise<void>;
  onFail: (error: unknown, retry: () => void) => void;
};

/** Resolves true only when every step passes first time; a failed step's retry resumes there and calls onRetryDone once the rest pass. */
export const runPostSteps = (
  steps: PostStep[],
  onRetryDone: () => void,
): Promise<boolean> => {
  const runFrom = async (
    index: number,
    onDone?: () => void,
  ): Promise<boolean> => {
    if (index >= steps.length) {
      onDone?.();
      return true;
    }
    try {
      await steps[index].run();
    } catch (error) {
      steps[index].onFail(error, () => void runFrom(index, onRetryDone));
      return false;
    }
    return runFrom(index + 1, onDone);
  };

  return runFrom(0);
};

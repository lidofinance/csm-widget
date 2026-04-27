// Module-scoped retry ref — set by useFlowSubmit before resolve(),
// read by getGeneralTransactionModalStages in failed() handler.
// Safe: single-threaded, set-before-read, one form submits at a time.
let formRetryFn: (() => void) | undefined;

export const setFormRetry = (fn: () => void) => {
  formRetryFn = fn;
};

export const getFormRetry = () => formRetryFn;

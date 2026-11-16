export const NORMALIZE_QUEUE_FORM_TEST_ID = 'normalizeQueueForm';

export const NO_NEED_TO_NORMALIZE = 'No need to normalize queue';

// Same copy as the "You have unqueued keys" alert that links here
export const UNQUEUED_KEYS_NOTICE =
  'You have keys that were not included in the deposit queue. To include them in the queue - upload new keys, or normalize the queue.';

export type NormalizeQueueAction = 'no-access' | 'nothing' | 'normalize';

export type NormalizeQueueView = {
  canNormalize: boolean;
  notice: string;
  disabledReason?: string;
};

export const getNormalizeQueueView = (
  action: NormalizeQueueAction,
): NormalizeQueueView =>
  action === 'normalize'
    ? {
        canNormalize: true,
        notice: UNQUEUED_KEYS_NOTICE,
        disabledReason: undefined,
      }
    : {
        canNormalize: false,
        notice: NO_NEED_TO_NORMALIZE,
        disabledReason: NO_NEED_TO_NORMALIZE,
      };

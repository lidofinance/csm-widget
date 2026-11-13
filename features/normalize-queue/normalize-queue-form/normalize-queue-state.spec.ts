import {
  getNormalizeQueueView,
  NO_NEED_TO_NORMALIZE,
  UNQUEUED_KEYS_NOTICE,
} from './normalize-queue-state';

describe('getNormalizeQueueView', () => {
  it('enables the CTA and explains unqueued keys when normalizing', () => {
    expect(getNormalizeQueueView('normalize')).toEqual({
      canNormalize: true,
      notice: UNQUEUED_KEYS_NOTICE,
      disabledReason: undefined,
    });
  });

  it('disables the CTA when nothing is unqueued', () => {
    expect(getNormalizeQueueView('nothing')).toEqual({
      canNormalize: false,
      notice: NO_NEED_TO_NORMALIZE,
      disabledReason: NO_NEED_TO_NORMALIZE,
    });
  });

  it('treats no-access like nothing to normalize', () => {
    expect(getNormalizeQueueView('no-access').canNormalize).toBe(false);
  });

  it('keeps the existing alert copy', () => {
    expect(UNQUEUED_KEYS_NOTICE).toBe(
      'You have keys that were not included in the deposit queue. To include them in the queue - upload new keys, or normalize the queue.',
    );
  });
});

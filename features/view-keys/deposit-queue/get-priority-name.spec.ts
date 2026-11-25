import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { getPriorityName } from './get-priority-name';

describe('getPriorityName', () => {
  it.each([MODULE_NAME.CSM, undefined])('uses key names for %s', (module) => {
    expect(getPriorityName('queue', module)).toBe('Queued keys under limit');
    expect(getPriorityName('queueOverLimit', module)).toBe(
      'Queued keys over limit',
    );
    expect(getPriorityName('active', module)).toBe('Active keys');
    expect(getPriorityName('limit', module)).toBe('CSM stake limit');
    expect(getPriorityName('batch', module)).toBe('Your queued keys');
  });

  it('uses stake names for CSM_02', () => {
    const csm02 = MODULE_NAME.CSM_02;
    expect(getPriorityName('active', csm02)).toBe('Active stake');
    expect(getPriorityName('queue', csm02)).toBe('Queued stake');
    expect(getPriorityName('queueOverLimit', csm02)).toBe(
      'Queued stake (over limit)',
    );
    expect(getPriorityName('batch', csm02)).toBe('Your queued keys');
  });
});

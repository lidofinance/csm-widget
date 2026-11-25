import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { getCreateFlow } from './get-create-flow';

const def = { type: OPERATOR_TYPE.CSM_DEF, kind: 'create' } as const;
const ics = { type: OPERATOR_TYPE.CSM_ICS, kind: 'create' } as const;
const icsApply = { type: OPERATOR_TYPE.CSM_ICS, kind: 'apply' } as const;
const cm = { kind: 'create-cm' } as const;

describe('getCreateFlow', () => {
  it('goes straight to the form for a single CSM create', () => {
    expect(getCreateFlow([def])).toEqual({
      showAck: true,
      willChoose: false,
      directType: OPERATOR_TYPE.CSM_DEF,
    });
  });
  it('chooses after Ack when CM is also creatable', () => {
    expect(getCreateFlow([def, cm])).toEqual({
      showAck: true,
      willChoose: true,
      directType: undefined,
    });
  });
  it('skips Ack for apply-only wallets', () => {
    expect(getCreateFlow([icsApply])).toEqual({
      showAck: false,
      willChoose: true,
      directType: undefined,
    });
    expect(getCreateFlow([icsApply, cm])).toEqual({
      showAck: false,
      willChoose: true,
      directType: undefined,
    });
  });
  it('shows Ack then Choose for apply plus create', () => {
    expect(getCreateFlow([def, icsApply])).toEqual({
      showAck: true,
      willChoose: true,
      directType: undefined,
    });
  });
  it('skips Ack for CM only', () => {
    expect(getCreateFlow([cm])).toEqual({
      showAck: false,
      willChoose: true,
      directType: undefined,
    });
  });
  it('goes direct for a single paired create', () => {
    expect(getCreateFlow([ics]).directType).toBe(OPERATOR_TYPE.CSM_ICS);
  });
});

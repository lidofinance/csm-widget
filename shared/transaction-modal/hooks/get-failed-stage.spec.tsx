// shared/transaction-modal/hooks/get-failed-stage.spec.tsx
// Stubs required before imports that transitively load next.js runtime.
jest.mock('utils/track-matomo-event', () => ({
  trackMatomoError: jest.fn(),
}));

// Mock the utils barrel so get-failed-stage's `import { resolveError } from 'utils'`
// resolves to a controllable spy.
jest.mock('utils', () => ({
  resolveError: jest.fn(),
}));

// TxStageFail uses hooks that need full React context; replace with a recorder.
jest.mock('shared/transaction-modal/tx-stages-basic', () => ({
  TxStageFail: jest.fn(() => null),
}));

import React from 'react';
import { ErrorCode } from 'utils/get-error-code';
import { resolveError } from 'utils';
import { TxStageFail } from 'shared/transaction-modal/tx-stages-basic';
import { getFailedStage } from './get-failed-stage';

const mockResolveError = resolveError as jest.MockedFunction<
  typeof resolveError
>;

describe('getFailedStage', () => {
  let transitStage: jest.Mock;

  beforeEach(() => {
    transitStage = jest.fn();
    transitStage.mockClear();
    mockResolveError.mockClear();
  });

  it('calls transitStage with <TxStageFail> whose code and error match resolveError output', () => {
    mockResolveError.mockReturnValue({
      code: ErrorCode.DENIED_SIG,
      description: undefined,
    });

    getFailedStage(transitStage)(new Error('denied'));

    expect(transitStage).toHaveBeenCalledTimes(1);
    const [element] = transitStage.mock.calls[0];
    expect(React.isValidElement(element)).toBe(true);
    expect(element.type).toBe(TxStageFail);
    expect(element.props).toMatchObject({
      code: ErrorCode.DENIED_SIG,
      error: undefined,
    });
  });

  it('passes description to <TxStageFail> error prop when resolveError returns one', () => {
    const description = 'Bond is still locked';
    mockResolveError.mockReturnValue({
      code: ErrorCode.CONTRACT_ERROR,
      description,
    });

    getFailedStage(transitStage)(new Error('BondLockNotExpired'));

    const [element] = transitStage.mock.calls[0];
    expect(element.type).toBe(TxStageFail);
    expect(element.props).toMatchObject({
      code: ErrorCode.CONTRACT_ERROR,
      error: description,
    });
  });

  it('passes modalProps through to transitStage', () => {
    mockResolveError.mockReturnValue({
      code: ErrorCode.SOMETHING_WRONG,
      description: undefined,
    });
    const modalProps = { center: true };

    getFailedStage(transitStage, undefined, modalProps)(new Error('oops'));

    expect(transitStage).toHaveBeenCalledWith(expect.anything(), modalProps);
  });

  it('passes custom title to <TxStageFail>', () => {
    mockResolveError.mockReturnValue({
      code: ErrorCode.SOMETHING_WRONG,
      description: undefined,
    });

    getFailedStage(transitStage, 'Custom title')(new Error('oops'));

    const [element] = transitStage.mock.calls[0];
    expect(element.type).toBe(TxStageFail);
    expect(element.props).toMatchObject({ title: 'Custom title' });
  });

  it('calls resolveError with the original error', () => {
    mockResolveError.mockReturnValue({
      code: ErrorCode.SOMETHING_WRONG,
      description: undefined,
    });
    const error = new Error('some error');

    getFailedStage(transitStage)(error);

    expect(mockResolveError).toHaveBeenCalledWith(error);
  });
});

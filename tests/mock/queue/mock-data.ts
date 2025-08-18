import {
  ShareLimitInfo,
  NodeOperatorInfo,
  DepositQueueBatch,
} from '@lidofinance/lido-csm-sdk';
import { DepositDataInputType } from 'shared/hook-form/form-controller';

export type MockShareLimitParams = {
  active: number;
  queue: number;
  capacity: number;
  shareLimit?: number;
};

export type MockOperatorInfoParams = {
  depositableValidatorsCount: number;
};

export type MockFormDataParams = {
  depositDataLength: number;
};

export type MockDepositQueueParams = {
  // Array of queues, each containing batches with [nodeOperatorId, keysCount] pairs
  queues: Array<Array<[number, number]>>;
};

export type MockScenarioData = {
  nodeOperatorId: number;
  shareLimit: MockShareLimitParams;
  operatorInfo: MockOperatorInfoParams;
  formData: MockFormDataParams;
  depositQueueBatches: MockDepositQueueParams | null;
};

export const createMockShareLimit = ({
  active,
  queue,
  capacity,
  shareLimit = capacity,
}: MockShareLimitParams): ShareLimitInfo => {
  const activeBigInt = BigInt(active);
  const queueBigInt = BigInt(queue);
  const capacityBigInt = BigInt(capacity);
  const shareLimitBigInt = BigInt(shareLimit);

  const activeLeft =
    capacityBigInt > activeBigInt ? capacityBigInt - activeBigInt : 0n;

  return {
    active: activeBigInt,
    activeLeft,
    capacity: capacityBigInt,
    queue: queueBigInt,
    shareLimit: shareLimitBigInt,
  };
};

export const createMockOperatorInfo = ({
  depositableValidatorsCount,
}: MockOperatorInfoParams): NodeOperatorInfo => {
  return {
    totalAddedKeys: 0,
    totalWithdrawnKeys: 0,
    totalDepositedKeys: 0,
    totalVettedKeys: 0,
    stuckValidatorsCount: 0,
    depositableValidatorsCount,
    targetLimit: 0,
    targetLimitMode: 0,
    totalExitedKeys: 0,
    enqueuedCount: 0,
    managerAddress: '0x0000000000000000000000000000000000000000',
    rewardsAddress: '0x0000000000000000000000000000000000000000',
    extendedManagerPermissions: false,
    usedPriorityQueue: false,
  };
};

export const createMockDepositQueueBatches = ({
  queues,
}: MockDepositQueueParams): DepositQueueBatch[][] => {
  return queues.map((queueBatches) =>
    queueBatches.map(([nodeOperatorId, keysCount]) => ({
      nodeOperatorId: BigInt(nodeOperatorId),
      keysCount: BigInt(keysCount),
    })),
  );
};

export const createMockFormData = ({
  depositDataLength,
}: MockFormDataParams): DepositDataInputType => {
  const mockDepositItem = {
    pubkey:
      '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    withdrawal_credentials:
      '0x010000000000000000000000000000000000000000000000000000000000000000',
    amount: 32000000000,
    signature:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    deposit_message_root:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    deposit_data_root:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    fork_version: '0x00000000',
    deposit_cli_version: '2.3.0',
    network_name: 'mainnet',
  };

  const depositData = Array.from(
    { length: depositDataLength },
    () => mockDepositItem,
  );

  return {
    rawDepositData: undefined,
    depositData,
    confirmKeysReady: true,
  };
};

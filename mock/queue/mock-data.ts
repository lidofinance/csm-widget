import {
  ShareLimitInfo,
  NodeOperatorInfo,
  DepositQueueBatch,
} from '@lidofinance/lido-csm-sdk';
import { DepositDataInputType } from 'shared/hook-form/deposit-data';

export type MockShareLimitParams = {
  active: number;
  queue: number;
  capacity: number;
  shareLimit?: number;
};

export type MockOperatorInfoParams = {
  depositableValidatorsCount: number;
  totalDepositedKeys?: number;
  enqueuedCount?: number;
};

export type MockFormDataParams = {
  depositDataLength: number;
};

export type MockDepositQueueParams = {
  // Array of priority queues, each containing batches with [nodeOperatorId, keysCount] pairs
  // Index 0 = Priority 0 (highest), Index 5 = Priority 5 (lowest)
  priorities: Array<Array<[number, number]>>;
};

export type MockCurveParams = {
  priority: number;
  maxDeposits: number;
  lowestPriority: number;
};

export type MockScenarioData = {
  nodeOperatorId: number;
  shareLimit: MockShareLimitParams;
  operatorInfo: MockOperatorInfoParams;
  formData: MockFormDataParams;
  depositQueueBatches: MockDepositQueueParams | undefined;
  curveParams?: MockCurveParams;
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
  totalDepositedKeys = 0,
  enqueuedCount = 0,
}: MockOperatorInfoParams): NodeOperatorInfo => {
  return {
    totalAddedKeys: 0,
    totalWithdrawnKeys: 0,
    totalDepositedKeys,
    totalVettedKeys: 0,
    stuckValidatorsCount: 0,
    depositableValidatorsCount,
    targetLimit: 0,
    targetLimitMode: 0,
    totalExitedKeys: 0,
    enqueuedCount,
    managerAddress: '0x0000000000000000000000000000000000000000',
    rewardsAddress: '0x0000000000000000000000000000000000000000',
    extendedManagerPermissions: false,
    usedPriorityQueue: false,
  };
};

export const createMockDepositQueueBatches = ({
  priorities,
}: MockDepositQueueParams): DepositQueueBatch[][] => {
  const mappedPriorities = priorities.map((priorityBatches) =>
    priorityBatches.map(([nodeOperatorId, keysCount]) => ({
      nodeOperatorId: BigInt(nodeOperatorId),
      keysCount: keysCount,
    })),
  );

  // Always return exactly 6 arrays (priorities 0-5)
  const result: DepositQueueBatch[][] = [];
  for (let i = 0; i < 6; i++) {
    result.push(mappedPriorities[i] || []);
  }

  return result;
};

export const createMockCurveParams = ({
  priority,
  maxDeposits,
  lowestPriority,
}: MockCurveParams) => {
  return {
    queueConfig: {
      priority,
      maxDeposits,
      lowestPriority,
    },
  };
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

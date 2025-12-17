import { ValidatorRewardsEntity } from '@lidofinance/lido-csm-sdk';
import { useNodeOperatorId } from 'modules/web3';
import { useTable } from 'providers/table-provider';
import { useState } from 'react';
import { exportToCsv, formatDate, formatPercent } from 'utils';

const headers = {
  indexInReport: 'Index in Report',
  validatorIndex: 'Validator Index',
  pubkey: 'Public Key',
  slashed: 'Slashed',
  performance: 'Performance',
  threshold: 'Threshold',
  fee: 'Fee',
  receivedShares: 'Received Shares',
  receivedRewards: 'Received Rewards',
  startTimestamp: 'Start Timestamp',
  endTimestamp: 'End Timestamp',
  refSlot: 'Ref Slot',
  blockNumber: 'Block Number',
};

type CsvRow = Record<keyof typeof headers, string>;

const transformData = (data: ValidatorRewardsEntity[]): CsvRow[] => {
  return data.map((record) => ({
    indexInReport: String(record.indexInReport),
    validatorIndex: record.validatorIndex,
    pubkey: record.pubkey || '',
    slashed: String(record.slashed),
    performance: formatPercent(record.performance),
    threshold: formatPercent(record.threshold),
    fee: formatPercent(record.fee),
    receivedShares: String(record.receivedShares),
    receivedRewards: String(record.receivedRewards),
    startTimestamp: String(record.startTimestamp),
    endTimestamp: String(record.endTimestamp),
    refSlot: String(record.refSlot),
    blockNumber: String(record.blockNumber),
  }));
};

export const useRewardsHistoryExport = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { rawData } = useTable<ValidatorRewardsEntity>();
  const [isExporting, setIsExporting] = useState(false);

  const exportRewards = async () => {
    try {
      setIsExporting(true);

      const csvData = transformData(rawData);
      const operator =
        nodeOperatorId !== undefined ? `csm-${nodeOperatorId}` : '';
      const date = formatDate(Date.now(), 'yyyy-MM-dd');
      const filename = ['rewards-history', operator, date]
        .filter(Boolean)
        .join('-');

      exportToCsv(csvData, headers, filename);
    } catch (error) {
      console.error('Failed to export rewards history:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToCsv: exportRewards,
    isExporting,
  };
};

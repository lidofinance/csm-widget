import { useEffect, useState } from 'react';
import { useGetOperatorPerformance } from './use-get-operator-performance';
import { Range, ValidatorStats } from '../performance/types';
import { useAccount } from 'shared/hooks';

export const useGetPerformanceByRange = (range: Range) => {
  const [isLoading, setIsLoading] = useState(true);
  const { operatorData } = useGetOperatorPerformance();
  const [operatorDataByRange, setOperatorDataByRange] = useState<
    Record<string, any>
  >({});
  const [validatorsStats, setValidatorsStats] = useState<ValidatorStats[]>([]);
  const [threshold, setThreshold] = useState<number>(0);
  const [thresholdsByEpoch, setThresholdsByEpoch] = useState<any[]>([]);

  const { chainId } = useAccount();

  const epochRanges: Record<Range, number> = {
    week: 1575, // 7 days * 225 epochs / day
    month: 7650, // 30 days * 225 epochs / day
    year: 82125, // 365 days * 225 epochs / day
    ever: Infinity,
  };

  const epochsInRange = epochRanges[range];

  useEffect(() => {
    if (!operatorData) return;

    setIsLoading(true);
    const sortedKeys = Object.keys(operatorData).sort((a, b) => {
      const [startA] = a.split('-').map(Number);
      const [startB] = b.split('-').map(Number);
      return startB - startA; // Sort descending by epoch start
    });

    let totalEpochs = 0;
    const filteredData: Record<string, any> = {};
    let previousEntry: string | null = null;

    // Filter data based on range for operatorDataByRange
    for (const key of sortedKeys) {
      const [startEpoch, endEpoch] = key.split('-').map(Number);
      const epochDiff = endEpoch - startEpoch;

      if (totalEpochs + epochDiff > epochsInRange) {
        if (chainId === 1) {
          if (range === 'month' && !previousEntry) {
            previousEntry = key;
          }
        } else {
          if (range === 'week' && !previousEntry) {
            previousEntry = key;
          }
        }
        break;
      }

      filteredData[key] = operatorData[key];
      totalEpochs += epochDiff;
    }

    setOperatorDataByRange(filteredData);

    // Filter data for thresholdsByEpoch
    const thresholdsData = { ...filteredData };
    if (chainId === 1) {
      if (range === 'month' && previousEntry) {
        thresholdsData[previousEntry] = operatorData[previousEntry];
      }
    } else {
      if (range === 'week' && previousEntry && !thresholdsData[previousEntry]) {
        thresholdsData[previousEntry] = operatorData[previousEntry];
      }
    }

    setThresholdsByEpoch(
      Object.entries(thresholdsData)
        .map(([_, value]) => {
          const endFrame = value.frame[1].toString();
          const lidoThreshold = value.threshold * 100; // Convert to percentage

          const validatorRatios = Object.entries(value.data.validators).reduce(
            (acc, [validatorId, validatorData]) => {
              const validatorPerf = (validatorData as any).perf;
              acc[validatorId] =
                (validatorPerf.included / validatorPerf.assigned) * 100; // Convert to percentage
              return acc;
            },
            {} as Record<string, number>,
          );

          return {
            name: endFrame,
            lidoThreshold,
            ...validatorRatios,
          };
        })
        .reverse(), // Reverse for oldest first
    );
  }, [chainId, epochsInRange, operatorData, range]);

  useEffect(() => {
    if (!operatorDataByRange) return;

    const statsPerValidator: { [key: string]: ValidatorStats[] } = {};
    const thresholds: number[] = [];

    // Process data for validatorsStats
    for (const key of Object.keys(operatorDataByRange)) {
      const validatorsData = operatorDataByRange[key]?.data?.validators || {};
      thresholds.push(operatorDataByRange[key]?.threshold);

      for (const validator of Object.keys(validatorsData)) {
        if (!statsPerValidator[validator]) {
          statsPerValidator[validator] = [];
        }

        const validatorPerf = validatorsData[validator].perf;
        const attestations = {
          included: validatorPerf.included,
          assigned: validatorPerf.assigned,
        };

        statsPerValidator[validator].push({
          index: parseInt(validator),
          attestations,
          efficiency: validatorPerf.included / validatorPerf.assigned,
        });
      }
    }

    // Calculate average threshold
    setThreshold(
      thresholds.reduce((sum, value) => sum + value, 0) / thresholds.length,
    );

    const getValidatorStats = (
      data: Record<string, any[]>,
    ): ValidatorStats[] => {
      return Object.entries(data).map(([key, entries]) => {
        const totalAssigned = entries.reduce(
          (sum, entry) => sum + entry.attestations.assigned,
          0,
        );
        const totalIncluded = entries.reduce(
          (sum, entry) => sum + entry.attestations.included,
          0,
        );
        const totalEfficiency = entries.reduce(
          (sum, entry) => sum + (entry.efficiency || 0),
          0,
        );

        return {
          index: parseInt(key, 10),
          attestations: {
            assigned: totalAssigned,
            included: totalIncluded,
          },
          efficiency: totalEfficiency / entries.length,
        };
      });
    };

    // Calculate stats for validators
    const result = getValidatorStats(statsPerValidator);
    setValidatorsStats(result);
  }, [operatorDataByRange]);

  useEffect(() => {
    setIsLoading(false);
  }, [validatorsStats]);

  return {
    isLoading,
    validatorsStats,
    threshold,
    thresholdsByEpoch,
  };
};

import { TestScenario } from './test-scenarios';

/**
 * Real production queue data snapshot
 *
 * This scenario is based on actual production queue state captured from mainnet.
 * It represents a real-world distribution of validators across priorities with
 * operator 346 being the primary focus (having the most keys in priority 4).
 *
 * Key characteristics:
 * - High-volume scenario with 8869 active validators
 * - Large capacity (13257) with 2331 in queue
 * - Priorities 0-3 are empty
 * - Priority 4 contains the bulk of queued keys
 * - Priority 5 has additional diverse operator distribution
 * - Note: Original data had priority 6, excluded for system compatibility (expects 6 priorities: 0-5)
 */
export const realCaseScenario: TestScenario = {
  title: '[Real] Production Queue Snapshot',
  description:
    'Real mainnet queue state - operator 346 dominates priority 4 with 905 keys, high-volume scenario with 8869 active validators',
  data: {
    nodeOperatorId: 253,
    shareLimit: {
      active: 8869,
      queue: 2331,
      capacity: 13257,
      shareLimit: 500,
    },
    operatorInfo: {
      depositableValidatorsCount: 1, // Matches operator 346's total keys in priority 4
    },
    formData: {
      depositDataLength: 0, // No new keys being submitted
    },
    depositQueueBatches: {
      priorities: [
        // Priority 0: Empty (highest priority)
        [],
        // Priority 1: Empty (reserved)
        [],
        // Priority 2: Empty (reserved)
        [],
        // Priority 3: Empty (reserved)
        [],
        // Priority 4: Legacy queue - operator 346 dominates with 905 keys
        [
          [346, 51],
          [346, 150],
          [346, 150],
          [346, 150],
          [346, 150],
          [346, 150],
          [346, 103],
          [346, 1],
          [457, 1],
          [457, 25],
          [239, 1],
          [458, 25],
          [458, 25],
          [458, 25],
          [458, 15],
          [457, 25],
          [457, 25],
          [457, 25],
          [452, 1],
          [457, 25],
          [457, 25],
          [457, 25],
          [457, 25],
          [459, 1],
          [99, 2],
          [460, 3],
          [461, 1],
          [333, 25],
          [344, 5],
          [344, 4],
          [333, 25],
          [333, 25],
          [333, 25],
          [427, 1],
          [325, 2],
          [125, 25],
          [125, 25],
          [125, 18],
          [427, 1],
          [99, 1],
          [463, 1],
          [357, 1],
          [295, 3],
        ],
        // Priority 5: General queue - diverse operator distribution
        [
          [253, 1],
          [464, 15],
          [465, 1],
          [25, 3],
          [25, 1],
          [49, 4],
          [206, 1],
          [286, 2],
          [291, 15],
          [466, 100],
          [103, 1],
          [237, 10],
          [427, 1],
          [257, 2],
          [427, 1],
          [207, 4],
          [127, 15],
          [466, 20],
          [201, 5],
          [185, 4],
          [243, 4],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [399, 10],
          [469, 6],
          [464, 14],
          [294, 64],
          [460, 3],
          [294, 77],
          [171, 100],
          [50, 5],
          [17, 1],
          [17, 1],
          [17, 1],
          [17, 1],
          [17, 1],
          [17, 1],
          [470, 1],
          [471, 1],
          [260, 6],
          [464, 61],
          [472, 1],
          [461, 2],
          [152, 80],
          [473, 1],
          [99, 1],
        ],
      ],
    },
  },
};

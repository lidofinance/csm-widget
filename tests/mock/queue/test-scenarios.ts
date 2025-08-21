import { MockScenarioData } from './mock-data';

export type TestScenario = {
  title: string;
  description: string;
  data: MockScenarioData;
};

export const testScenarios: TestScenario[] = [
  // ========================================
  // GROUP A: BASIC QUEUE STATES
  // ========================================
  {
    title: '[Basic] Empty Queue',
    description: 'No active keys, no queued keys - fresh start state',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 0,
        queue: 0,
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 0,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [[], [], [], [], [], []], // All priorities empty
      },
    },
  },
  {
    title: '[Basic] Active Keys Only - No Queue',
    description:
      'Only active validators, empty queue - typical established operator',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 0,
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 0, // No keys in queue
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [[], [], [], [], [], []], // All priorities empty
      },
    },
  },
  {
    title: '[Basic] Queue Within CSM Limit',
    description: 'Active + queue stays within CSM capacity',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 150,
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 60, // Realistic: slightly less than batch sum (65) due to stale data
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [[1, 45]], // Priority 0: 45 keys for operator 1
          [],
          [],
          [], // Priorities 1-3: Empty (reserved)
          [[2, 40]], // Priority 4: Other operator
          [
            [1, 20],
            [3, 45],
          ], // Priority 5: 20 keys for operator 1, others
        ],
      },
    },
  },
  {
    title: '[Basic] Queue Exactly at CSM Limit',
    description: 'Queue fills exactly to CSM capacity',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 400,
        queue: 100,
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 45, // Exactly matches operator batch sum
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 35],
            [1, 30],
          ], // Priority 0: operator at end
          [],
          [],
          [], // Reserved priorities
          [], // Priority 4: empty
          [
            [1, 15],
            [3, 20],
          ], // Priority 5: operator first, others
        ],
      },
    },
  },
  {
    title: '[Basic] Queue Exceeds CSM Limit',
    description: 'Queue extends beyond CSM capacity - over limit scenario',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 250,
        capacity: 450, // Only 150 capacity left
      },
      operatorInfo: {
        depositableValidatorsCount: 80, // Less than batch sum (90) - keys were removed
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 60],
            [1, 50],
          ], // Priority 0: 110 total
          [],
          [],
          [], // Reserved
          [[3, 40]], // Priority 4: 40 keys
          [
            [1, 40],
            [4, 60],
          ], // Priority 5: 100 total
        ],
      },
    },
  },

  // ========================================
  // GROUP B: PRIORITY DISTRIBUTION (0, 4, 5)
  // ========================================
  {
    title: '[Priority] Keys Only in Priority 0',
    description: 'All validators in highest priority queue only',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 180,
        capacity: 600,
      },
      operatorInfo: {
        depositableValidatorsCount: 70, // Less than batch sum (80) - some keys removed
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 80],
            [2, 60],
            [3, 40],
          ], // Priority 0: All keys here
          [],
          [],
          [],
          [],
          [], // All other priorities empty
        ],
      },
    },
  },
  {
    title: '[Priority] Keys Only in Legacy Queue (P4)',
    description: 'All validators in legacy priority queue only',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 150,
        queue: 200,
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 55, // Matches batch sum exactly
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [],
          [],
          [],
          [], // Priorities 0-3: Empty
          [
            [2, 70],
            [1, 55],
            [3, 45],
            [4, 30],
          ], // Priority 4: All keys here
          [], // Priority 5: Empty
        ],
      },
    },
  },
  {
    title: '[Priority] Keys Only in General Queue (P5)',
    description: 'All validators in general (lowest) priority queue only',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 100,
        queue: 250,
        capacity: 600,
      },
      operatorInfo: {
        depositableValidatorsCount: 65, // Less than batch sum (75) - stale data
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [],
          [],
          [],
          [],
          [], // Priorities 0-4: Empty
          [
            [2, 80],
            [1, 75],
            [3, 60],
            [4, 35],
          ], // Priority 5: All keys here
        ],
      },
    },
  },
  {
    title: '[Priority] Keys in Priority 0 and 5 Only',
    description: 'Edge priorities only - highest and lowest priority',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 220,
        capacity: 600,
      },
      operatorInfo: {
        depositableValidatorsCount: 85, // Less than batch sum (90) - some removal
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 50],
            [1, 60],
          ], // Priority 0: 110 total
          [],
          [],
          [], // Priorities 1-3: Reserved
          [], // Priority 4: Empty
          [
            [1, 30],
            [3, 80],
          ], // Priority 5: 110 total
        ],
      },
    },
  },
  {
    title: '[Priority] Keys in Priority 0, 4, and 5',
    description: 'Realistic distribution across production priorities',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 300,
        capacity: 700,
      },
      operatorInfo: {
        depositableValidatorsCount: 95, // Less than batch sum (105) - realistic stale data
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 50],
            [2, 40],
          ], // Priority 0: 90 total
          [],
          [],
          [], // Reserved priorities
          [
            [3, 60],
            [1, 35],
          ], // Priority 4: 95 total
          [
            [1, 20],
            [4, 55],
            [5, 40],
          ], // Priority 5: 115 total
        ],
      },
    },
  },

  // ========================================
  // GROUP C: OPERATOR POSITION SCENARIOS
  // ========================================
  {
    title: '[Position] Operator at Beginning of Queues',
    description: 'Operator batches positioned at start of priority segments',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 320, // 120 + 120 + 80 = 320 total
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 70, // Less than batch sum (80)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 50],
            [2, 40],
            [3, 30],
          ], // Priority 0: Operator first
          [],
          [],
          [], // Reserved
          [
            [1, 30],
            [4, 50],
            [5, 40],
          ], // Priority 4: Operator first
          [
            [6, 30],
            [7, 20],
            [8, 30],
          ], // Priority 5: No operator
        ],
      },
    },
  },
  {
    title: '[Position] Operator at End of Queues',
    description: 'Operator batches positioned at end of priority segments',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 260,
        capacity: 700,
      },
      operatorInfo: {
        depositableValidatorsCount: 65, // Less than batch sum (75)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 60],
            [3, 40],
            [1, 45],
          ], // Priority 0: Operator last
          [],
          [],
          [], // Reserved
          [], // Priority 4: Empty
          [
            [4, 50],
            [5, 35],
            [1, 30],
          ], // Priority 5: Operator last
        ],
      },
    },
  },
  {
    title: '[Position] Operator with Adjacent Batches (Should Merge)',
    description:
      'Consecutive operator batches that should merge in visualization',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 285, // 130 + 85 + 70 = 285 total
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 85, // Matches batch sum exactly
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 30],
            [1, 25],
            [1, 35],
            [3, 40],
          ], // Priority 0: Adjacent operator batches pos 2-3
          [],
          [],
          [], // Reserved
          [
            [1, 20],
            [1, 5],
            [4, 60],
          ], // Priority 4: Adjacent operator batches pos 1-2
          [
            [5, 40],
            [6, 30],
          ], // Priority 5: No operator
        ],
      },
    },
  },
  {
    title: '[Position] Operator as Only Batch in Priority',
    description: 'Priority segments where operator is the sole participant',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 140,
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 90, // Matches batch sum exactly
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [[1, 60]], // Priority 0: Only operator
          [],
          [],
          [], // Reserved
          [[1, 30]], // Priority 4: Only operator
          [
            [2, 40],
            [3, 10],
          ], // Priority 5: Other operators only
        ],
      },
    },
  },
  {
    title: '[Position] Operator Single Key at Very End of Queue',
    description:
      'Operator has exactly 1 key positioned at the absolute end of all queues',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 201, // 200 + 1 = 201 total
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 1, // Exactly matches batch sum
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 80],
            [3, 60],
          ], // Priority 0: Other operators
          [],
          [],
          [], // Reserved priorities
          [
            [4, 50],
            [5, 40],
          ], // Priority 4: Other operators
          [
            [6, 30],
            [7, 20],
            [8, 10],
            [1, 1],
          ], // Priority 5: Operator at very end
        ],
      },
    },
  },
  {
    title: '[Position] Single Key at End + Submitting One More',
    description: 'Operator has 1 key at queue end and submits 1 additional key',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 150,
        queue: 181, // 180 + 1 = 181 total
        capacity: 400,
      },
      operatorInfo: {
        depositableValidatorsCount: 1, // Current queue keys
        totalDepositedKeys: 20,
        enqueuedCount: 1,
      },
      formData: {
        depositDataLength: 1, // Submitting 1 more key
      },
      curveParams: {
        priority: 0,
        maxDeposits: 30, // Room for 9 more (30 - 20 deposited - 1 queued)
        lowestPriority: 5,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 70],
            [3, 50],
          ], // Priority 0: Other operators, will receive the new key
          [],
          [],
          [], // Reserved priorities
          [[4, 60]], // Priority 4: Other operator
          [
            [5, 40],
            [6, 20],
            [1, 1],
          ], // Priority 5: Operator at very end with 1 key
        ],
      },
    },
  },

  // ========================================
  // GROUP D: STALE BATCH DATA EDGE CASES
  // ========================================
  {
    title: '[Stale] Operator with Zero Depositable Keys',
    description:
      'All operator keys removed but batches still in queue (stale data)',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 400,
        queue: 200,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 0, // All keys were removed
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 40],
            [2, 50],
          ], // Priority 0: Stale operator batch
          [],
          [],
          [], // Reserved
          [], // Priority 4: Empty
          [
            [1, 35],
            [3, 75],
          ], // Priority 5: More stale operator batches
        ],
      },
    },
  },
  {
    title: '[Stale] Large Batch Sum vs Small Depositable Count',
    description: 'Significant difference due to key removals',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 350,
        queue: 250,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 15, // Very small compared to batch sum (120)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 80],
            [2, 60],
          ], // Priority 0: Large stale batch
          [],
          [],
          [], // Reserved
          [
            [1, 40],
            [3, 70],
          ], // Priority 4: More stale batches
          [], // Priority 5: Empty
        ],
      },
    },
  },
  {
    title: '[Stale] Multiple Operators with Stale Data',
    description:
      'Several operators have inconsistent batch vs depositable counts',
    data: {
      nodeOperatorId: 2, // Focus on operator 2
      shareLimit: {
        active: 300,
        queue: 400,
        capacity: 900,
      },
      operatorInfo: {
        depositableValidatorsCount: 25, // Much less than batch sum (80)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 100],
            [2, 50],
          ], // Priority 0: Op 1 has 100, Op 2 has 50 (stale)
          [],
          [],
          [], // Reserved
          [
            [2, 30],
            [3, 90],
          ], // Priority 4: More stale data for Op 2
          [
            [4, 60],
            [5, 70],
          ], // Priority 5: Other operators
        ],
      },
    },
  },

  // ========================================
  // GROUP E: CAPACITY & LIMIT EDGE CASES
  // ========================================
  {
    title: '[Edge] Zero Capacity',
    description: 'Testing edge case with zero CSM capacity',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 100,
        queue: 50,
        capacity: 0, // Edge case
      },
      operatorInfo: {
        depositableValidatorsCount: 25,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [[1, 30]], // Priority 0: Over limit
          [],
          [],
          [],
          [], // Other priorities
          [[2, 20]], // Priority 5: Other operator
        ],
      },
    },
  },
  {
    title: '[Edge] Extremely Low Capacity (2 keys room)',
    description: 'Very tight capacity limit with large queue',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 198,
        queue: 150,
        capacity: 200, // Only 2 keys room left
      },
      operatorInfo: {
        depositableValidatorsCount: 35, // Less than batch sum (45)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [[2, 50]], // Priority 0: Other operator, over limit
          [],
          [],
          [], // Reserved
          [], // Priority 4: Empty
          [
            [1, 45],
            [3, 55],
          ], // Priority 5: All over limit
        ],
      },
    },
  },
  {
    title: '[Edge] Single Key Scenarios',
    description: 'Minimum width testing with single validator keys',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 100,
        queue: 6,
        capacity: 200,
      },
      operatorInfo: {
        depositableValidatorsCount: 3, // Less than batch sum (4)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [[1, 2]], // Priority 0: 2 keys
          [],
          [],
          [], // Reserved
          [[1, 1]], // Priority 4: 1 key
          [
            [1, 1],
            [2, 2],
          ], // Priority 5: Mixed
        ],
      },
    },
  },

  // ========================================
  // GROUP F: KEY SUBMISSION SCENARIOS
  // ========================================
  {
    title: '[Submit] Submitting to Empty Priority 0',
    description: 'Priority 0 empty, all 20 submitted keys should go to P0',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 100,
        capacity: 600,
      },
      operatorInfo: {
        depositableValidatorsCount: 0, // No current queue keys
        totalDepositedKeys: 10,
        enqueuedCount: 0,
      },
      formData: {
        depositDataLength: 20, // Submitting 20 keys
      },
      curveParams: {
        priority: 0,
        maxDeposits: 50, // Room for 40 more (50 - 10 deposited)
        lowestPriority: 5,
      },
      depositQueueBatches: {
        priorities: [
          [], // Priority 0: Empty, will receive all 20 keys
          [],
          [],
          [], // Reserved
          [[2, 40]], // Priority 4: Other operator
          [[3, 60]], // Priority 5: Other operator
        ],
      },
    },
  },
  {
    title: '[Submit] Priority 0 Partial, Split Submission',
    description: 'P0 partially full, keys split between P0 and P5',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 150,
        capacity: 600,
      },
      operatorInfo: {
        depositableValidatorsCount: 0,
        totalDepositedKeys: 25,
        enqueuedCount: 10,
      },
      formData: {
        depositDataLength: 18, // Submitting 18 keys
      },
      curveParams: {
        priority: 0,
        maxDeposits: 40, // Only 5 slots left (40 - 25 deposited - 10 queued)
        lowestPriority: 5,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 60],
            [3, 40],
          ], // Priority 0: Has other operators
          [],
          [],
          [], // Reserved
          [], // Priority 4: Empty
          [[4, 50]], // Priority 5: Will receive overflow (13 keys)
        ],
      },
    },
  },
  {
    title: '[Submit] Priority 0 at Max, All to P5',
    description: 'P0 at maxDeposits limit, all submitted keys go to P5',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 200,
        capacity: 700,
      },
      operatorInfo: {
        depositableValidatorsCount: 0,
        totalDepositedKeys: 30,
        enqueuedCount: 20,
      },
      formData: {
        depositDataLength: 15, // Submitting 15 keys
      },
      curveParams: {
        priority: 0,
        maxDeposits: 50, // Already at limit (30 deposited + 20 queued)
        lowestPriority: 5,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 80],
            [3, 60],
          ], // Priority 0: At capacity
          [],
          [],
          [], // Reserved
          [], // Priority 4: Empty
          [[4, 60]], // Priority 5: Will receive all 15 keys
        ],
      },
    },
  },

  // ========================================
  // GROUP G: FALLBACK SCENARIOS
  // ========================================
  {
    title: '[Fallback] Undefined Queue Data (Fallback Mode)',
    description: 'Queue analysis failed, triggers general queue display',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 180,
        capacity: 600,
      },
      operatorInfo: {
        depositableValidatorsCount: 45,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: undefined, // Triggers fallback
    },
  },
  {
    title: '[Fallback] Fallback with Queue Over Limit',
    description: 'Fallback mode with queue exceeding CSM capacity',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 400,
        queue: 350, // Over limit
        capacity: 600,
      },
      operatorInfo: {
        depositableValidatorsCount: 85,
      },
      formData: {
        depositDataLength: 12,
      },
      depositQueueBatches: undefined, // Triggers fallback
    },
  },
  {
    title: '[Fallback] Fallback with Keys Being Added',
    description: 'Fallback mode while operator is submitting new keys',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 200,
        capacity: 700,
      },
      operatorInfo: {
        depositableValidatorsCount: 65,
      },
      formData: {
        depositDataLength: 25, // Large key submission
      },
      depositQueueBatches: undefined, // Triggers fallback
    },
  },

  // ========================================
  // GROUP H: LARGE SCALE & STRESS TESTS
  // ========================================
  {
    title: '[Stress] High Volume Scenario',
    description: 'Large-scale testing with thousands of keys',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 8000,
        queue: 4200, // 1900 + 1000 + 1300 = 4200 total
        capacity: 15000,
      },
      operatorInfo: {
        depositableValidatorsCount: 800, // Less than batch sum (1200)
      },
      formData: {
        depositDataLength: 100,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 600],
            [2, 800],
            [3, 500],
          ], // Priority 0: 1900 total
          [],
          [],
          [], // Reserved
          [
            [1, 400],
            [4, 600],
          ], // Priority 4: 1000 total
          [
            [1, 200],
            [5, 700],
            [6, 400],
          ], // Priority 5: 1300 total
        ],
      },
    },
  },
  {
    title: '[Stress] Maximum Queue Stress Test',
    description: 'Extreme scenario testing system limits',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 5000,
        queue: 10000,
        capacity: 12000,
      },
      operatorInfo: {
        depositableValidatorsCount: 1500, // Much less than batch sum (3000)
      },
      formData: {
        depositDataLength: 200,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 1000],
            [2, 1500],
            [3, 1000],
          ], // Priority 0: 3500 total
          [],
          [],
          [], // Reserved
          [
            [1, 1200],
            [4, 800],
            [5, 1000],
          ], // Priority 4: 3000 total
          [
            [1, 800],
            [6, 1200],
            [7, 1500],
          ], // Priority 5: 3500 total
        ],
      },
    },
  },

  // ========================================
  // GROUP I: QUEUE COEFFICIENT SCENARIOS
  // ========================================
  {
    title: '[Coeff] Queue Sum Mismatch (Coefficient Test)',
    description:
      'Batch totals differ from shareLimit.queue for coefficient calculation',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 250, // Doesn't match actual batch sum (300)
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 60, // Less than batch sum (80)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 50],
            [2, 60],
          ], // Priority 0: 110 total
          [],
          [],
          [], // Reserved
          [
            [1, 30],
            [3, 70],
          ], // Priority 4: 100 total
          [[4, 90]], // Priority 5: 90 total
          // Total: 300 (doesn't match shareLimit.queue: 250)
        ],
      },
    },
  },

  // ========================================
  // GROUP J: RESERVED PRIORITIES SCENARIOS
  // ========================================
  {
    title: '[Reserved] Keys Only in Reserved Priority 1',
    description:
      'Testing reserved priority P1 - minimal usage for future feature testing',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 150,
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 40, // Less than batch sum (50) - stale data
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [], // Priority 0: Empty
          [
            [1, 50],
            [2, 60],
            [3, 40],
          ], // Priority 1: Reserved - testing usage
          [],
          [],
          [],
          [], // Other priorities empty
        ],
      },
    },
  },
  {
    title: '[Reserved] Keys Across Reserved Priorities P1-P3',
    description:
      'Testing all reserved priorities P1, P2, P3 for future feature compatibility',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 280,
        capacity: 700,
      },
      operatorInfo: {
        depositableValidatorsCount: 75, // Less than batch sum (90) - realistic stale data
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [], // Priority 0: Empty
          [
            [1, 40],
            [2, 30],
          ], // Priority 1: Reserved
          [
            [1, 30],
            [3, 50],
          ], // Priority 2: Reserved
          [
            [1, 20],
            [4, 40],
          ], // Priority 3: Reserved
          [], // Priority 4: Empty
          [[5, 70]], // Priority 5: Other operator
        ],
      },
    },
  },
  {
    title: '[Reserved] Mixed Production and Reserved Priorities',
    description:
      'Operator has keys in both production (P0, P5) and reserved (P2) priorities',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 320,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 85, // Less than batch sum (100) - some keys removed
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 50],
            [2, 40],
          ], // Priority 0: Production priority
          [], // Priority 1: Empty
          [
            [1, 30],
            [3, 60],
          ], // Priority 2: Reserved priority with operator
          [], // Priority 3: Empty
          [[4, 70]], // Priority 4: Other operator
          [
            [1, 20],
            [5, 50],
          ], // Priority 5: Production priority
        ],
      },
    },
  },
  {
    title: '[Reserved] Reserved Priority Over Capacity Limit',
    description: 'Reserved priority P2 extends beyond CSM capacity limit',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 450,
        queue: 200,
        capacity: 500, // Only 50 capacity left
      },
      operatorInfo: {
        depositableValidatorsCount: 60, // Less than batch sum (80) - stale data
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [[2, 30]], // Priority 0: Under limit (30 keys)
          [], // Priority 1: Empty
          [
            [1, 80],
            [3, 90],
          ], // Priority 2: Reserved, crosses and exceeds limit
          [],
          [],
          [], // Other priorities empty
        ],
      },
    },
  },

  // ========================================
  // GROUP K: ALL PRIORITIES SCENARIOS
  // ========================================
  {
    title: '[All Priorities] Comprehensive Queue with All 6 Priorities',
    description: 'All priorities (P0-P5) have keys - comprehensive queue state',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 580, // 100 + 80 + 90 + 70 + 110 + 130 = 580 total
        capacity: 1200,
      },
      operatorInfo: {
        depositableValidatorsCount: 85, // Less than batch sum (105) - stale data
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 60],
            [1, 40],
          ], // Priority 0: 100 total
          [
            [3, 50],
            [4, 30],
          ], // Priority 1: 80 total
          [
            [1, 35],
            [5, 55],
          ], // Priority 2: 90 total
          [
            [6, 45],
            [7, 25],
          ], // Priority 3: 70 total
          [
            [1, 30],
            [8, 80],
          ], // Priority 4: 110 total
          [
            [9, 70],
            [10, 40],
            [11, 20],
          ], // Priority 5: 130 total
        ],
      },
    },
  },
  {
    title: '[All Priorities] Operator Distributed Across All 6 Priorities',
    description: 'Operator has keys in every priority queue (P0-P5)',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 420, // 90 + 60 + 80 + 50 + 70 + 70 = 420 total
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 110, // Less than batch sum (125) - some keys removed
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 30],
            [2, 60],
          ], // Priority 0: Operator first, 90 total
          [
            [3, 40],
            [1, 20],
          ], // Priority 1: Operator second, 60 total
          [
            [1, 25],
            [4, 55],
          ], // Priority 2: Operator first, 80 total
          [
            [5, 35],
            [1, 15],
          ], // Priority 3: Operator last, 50 total
          [
            [1, 20],
            [6, 50],
          ], // Priority 4: Operator first, 70 total
          [
            [7, 35],
            [1, 15],
            [8, 20],
          ], // Priority 5: Operator middle, 70 total
        ],
      },
    },
  },
  {
    title: '[All Priorities] All Priorities Over Capacity Limit',
    description:
      'Every priority extends beyond CSM capacity - extreme over-limit',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 480,
        queue: 650, // 120 + 100 + 110 + 90 + 120 + 110 = 650 total
        capacity: 500, // Only 20 capacity left - all priorities over limit
      },
      operatorInfo: {
        depositableValidatorsCount: 80, // Less than batch sum (95) - significant stale data
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 70],
            [1, 50],
          ], // Priority 0: 120 total (over limit)
          [
            [3, 60],
            [4, 40],
          ], // Priority 1: 100 total (over limit)
          [
            [1, 25],
            [5, 85],
          ], // Priority 2: 110 total (over limit)
          [
            [6, 50],
            [7, 40],
          ], // Priority 3: 90 total (over limit)
          [
            [1, 20],
            [8, 100],
          ], // Priority 4: 120 total (over limit)
          [
            [9, 70],
            [10, 40],
          ], // Priority 5: 110 total (over limit)
        ],
      },
    },
  },
  {
    title: '[All Priorities] All Priorities Active - No Current Operator',
    description:
      'All priorities (P0-P5) have keys but current operator has none',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 480, // 80 + 70 + 90 + 60 + 100 + 80 = 480 total
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 0, // No keys in queue
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [2, 50],
            [3, 30],
          ], // Priority 0: 80 total, no operator 1
          [
            [4, 40],
            [5, 30],
          ], // Priority 1: 70 total, no operator 1
          [
            [6, 55],
            [7, 35],
          ], // Priority 2: 90 total, no operator 1
          [
            [8, 35],
            [9, 25],
          ], // Priority 3: 60 total, no operator 1
          [
            [10, 60],
            [11, 40],
          ], // Priority 4: 100 total, no operator 1
          [
            [12, 50],
            [13, 30],
          ], // Priority 5: 80 total, no operator 1
        ],
      },
    },
  },

  // ========================================
  // GROUP L: REALISTIC EDGE CASES
  // ========================================
  {
    title: '[Real] All Priorities Empty Except P5',
    description: 'Realistic scenario where only general queue has validators',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 150,
        queue: 180,
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 45, // Less than batch sum (50)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [],
          [],
          [],
          [], // Priorities 0-4: Empty
          [
            [1, 50],
            [2, 70],
            [3, 60],
          ], // Priority 5: All keys here
        ],
      },
    },
  },
  {
    title: '[Real] Far Away Indicator Trigger',
    description: 'Small queue with large capacity triggering far-away view',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 50,
        queue: 25,
        capacity: 2000, // Very large capacity
      },
      operatorInfo: {
        depositableValidatorsCount: 8,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [[2, 10]], // Priority 0: Small queue
          [],
          [],
          [],
          [], // Empty priorities
          [
            [1, 8],
            [3, 7],
          ], // Priority 5: Small operator presence
        ],
      },
    },
  },
  {
    title: '[Real] Operator Across All Production Priorities',
    description: 'Operator has keys in P0, P4, and P5 simultaneously',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 400,
        queue: 350,
        capacity: 900,
      },
      operatorInfo: {
        depositableValidatorsCount: 120, // Less than batch sum (140)
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        priorities: [
          [
            [1, 60],
            [2, 50],
          ], // Priority 0: Operator present
          [],
          [],
          [], // Reserved
          [
            [1, 40],
            [3, 70],
          ], // Priority 4: Operator present
          [
            [1, 40],
            [4, 60],
            [5, 30],
          ], // Priority 5: Operator present
        ],
      },
    },
  },
];

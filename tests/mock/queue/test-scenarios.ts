import { MockScenarioData } from './mock-data';

export type TestScenario = {
  title: string;
  description: string;
  data: MockScenarioData;
};

export const testScenarios: TestScenario[] = [
  {
    title: 'Empty Queue',
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
        queues: [
          [], // Empty queue
        ],
      },
    },
  },
  {
    title: 'Active Keys Only - No Queue',
    description:
      'Only active validators, empty queue - typical initial operator state',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 0,
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 5,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [], // Empty queue - no queued keys
        ],
      },
    },
  },
  {
    title: 'Queue Within CSM Limit',
    description: 'Active validators plus queue that stays within CSM capacity',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 150,
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 12,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            [1, 50], // Our operator: 50 keys
            [2, 40], // Other operator: 40 keys
            [3, 35], // Other operator: 35 keys
            [1, 25], // Our operator: 25 more keys
          ],
        ],
      },
    },
  },
  {
    title: 'Queue Exactly at CSM Limit',
    description: 'Queue fills exactly to CSM capacity with no room for more',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 400,
        queue: 100,
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 8,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            [1, 30], // Our operator: 30 keys
            [2, 35], // Other operator: 35 keys
            [3, 20], // Other operator: 20 keys
            [1, 15], // Our operator: 15 more keys
          ],
        ],
      },
    },
  },
  {
    title: 'Queue Exceeds CSM Limit',
    description: 'Queue extends beyond CSM capacity into over-limit territory',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 250, // 150 under limit + 100 over limit = 250 total
        capacity: 450,
      },
      operatorInfo: {
        depositableValidatorsCount: 20,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            [1, 60], // Our operator: 60 keys
            [2, 80], // Other operator: 80 keys
            [3, 55], // Other operator: 55 keys
            [1, 40], // Our operator: 40 more keys
            [4, 15], // Other operator: 15 keys
          ],
        ],
      },
    },
  },
  {
    title: 'Keys Being Added (Pending Submission)',
    description: 'New keys in form data waiting to be submitted to queue',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 350,
        queue: 200,
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 15,
      },
      formData: {
        depositDataLength: 25, // This creates the "added" state
      },
      depositQueueBatches: {
        queues: [
          [
            [1, 45], // Our operator: 45 keys
            [2, 65], // Other operator: 65 keys
            [3, 30], // Other operator: 30 keys
            [1, 35], // Our operator: 35 more keys
            [4, 25], // Other operator: 25 keys
          ],
        ],
      },
    },
  },
  {
    title: 'Queue Over Limit with Pending Keys',
    description: 'Queue exceeds CSM limit while new keys are being added',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 350, // 200 under limit + 150 over limit = 350 total
        capacity: 450,
      },
      operatorInfo: {
        depositableValidatorsCount: 35,
      },
      formData: {
        depositDataLength: 10, // Keys being added
      },
      depositQueueBatches: {
        queues: [
          [
            [1, 70], // Our operator: 70 keys
            [2, 90], // Other operator: 90 keys
            [3, 60], // Other operator: 60 keys
            [1, 55], // Our operator: 55 more keys
            [4, 40], // Other operator: 40 keys
            [5, 35], // Other operator: 35 keys
          ],
        ],
      },
    },
  },
  {
    title: 'Small Queue Triggering Far View',
    description:
      'Small queue relative to large capacity triggers far-away indicator',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 50,
        queue: 25,
        capacity: 2000, // Large capacity to trigger far away view
      },
      operatorInfo: {
        depositableValidatorsCount: 3,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            [1, 15], // Our operator: 15 keys (small batch)
            [2, 10], // Other operator: 10 keys
          ],
        ],
      },
    },
  },
  {
    title: 'Large Validator Counts Test',
    description: 'High-volume scenario with thousands of validators',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 5000,
        queue: 2000,
        capacity: 10000,
      },
      operatorInfo: {
        depositableValidatorsCount: 500,
      },
      formData: {
        depositDataLength: 100,
      },
      depositQueueBatches: {
        queues: [
          [
            [1, 400], // Our operator: 400 keys
            [2, 600], // Other operator: 600 keys
            [3, 300], // Other operator: 300 keys
            [1, 350], // Our operator: 350 more keys
            [4, 250], // Other operator: 250 keys
            [5, 100], // Other operator: 100 keys
          ],
        ],
      },
    },
  },
  {
    title: 'Edge Case - Zero Capacity',
    description: 'Testing edge case with zero capacity',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 100,
        queue: 50,
        capacity: 0, // Edge case
      },
      operatorInfo: {
        depositableValidatorsCount: 10,
      },
      formData: {
        depositDataLength: 5,
      },
      depositQueueBatches: {
        queues: [
          [
            [1, 20], // Our operator: 20 keys
            [2, 15], // Other operator: 15 keys
            [1, 15], // Our operator: 15 more keys
          ],
        ],
      },
    },
  },
  {
    title: 'Extremely Low Capacity Limit',
    description:
      'Very small capacity limit (2 keys) with queue heavily over limit',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 1, // Only 1 active key
        queue: 150, // Large queue
        capacity: 2, // Extremely low capacity - only 1 more key allowed
      },
      operatorInfo: {
        depositableValidatorsCount: 20,
      },
      formData: {
        depositDataLength: 3, // Trying to add more keys
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [1, 50], // Our operator: 50 keys
            [2, 40], // Other operator: 40 keys
          ],
          [
            // Priority 1
            [3, 35], // Other operator: 35 keys
            [1, 25], // Our operator: 25 keys
          ],
        ],
      },
    },
  },
  {
    title: 'Extremely Low Capacity with Far Away View',
    description:
      'Tiny capacity limit (3 keys) with very small queue triggering far view',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 100, // Only 1 active key
        queue: 100, // Very small queue - just 1 key
        capacity: 50, // Extremely low capacity - only 2 more keys allowed
      },
      operatorInfo: {
        depositableValidatorsCount: 0, // Very small depositable count
      },
      formData: {
        depositDataLength: 0, // No keys being added
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0 - minimal queue
            [2, 100], // Our operator: just 100 keys
          ],
          [], // Priority 1 - empty
          [], // Priority 2 - empty
          [], // Priority 3 - empty
          [], // Priority 4 - empty
          [], // Priority 5 - empty
        ],
      },
    },
  },

  // Enhanced Multi-Queue Test Scenarios
  {
    title: 'Keys Across All Priority Levels',
    description: 'Validators distributed across all 6 priority levels (0-5)',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 600, // Total across all priorities
        capacity: 1200,
      },
      operatorInfo: {
        depositableValidatorsCount: 25,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [1, 50],
            [2, 30],
            [1, 20], // 100 keys total
          ],
          [
            // Priority 1
            [3, 40],
            [4, 35],
            [1, 25], // 100 keys total
          ],
          [
            // Priority 2
            [5, 60],
            [1, 40], // 100 keys total
          ],
          [], // Priority 3 - empty
          [
            // Priority 4
            [6, 80],
            [7, 70], // 150 keys total
          ],
          [
            // Priority 5
            [1, 90],
            [8, 60], // 150 keys total
          ],
        ],
      },
    },
  },
  {
    title: 'Keys Only in Priority 0 and 5',
    description:
      'Edge priority distribution - only lowest and highest priorities have keys',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 300,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 18,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [1, 100],
            [2, 50],
          ],
          [], // Priority 1 - empty
          [], // Priority 2 - empty
          [], // Priority 3 - empty
          [], // Priority 4 - empty
          [
            // Priority 5
            [1, 80],
            [3, 70],
          ],
        ],
      },
    },
  },
  {
    title: 'Keys in Priority 0, 4, and 5',
    description:
      'Sparse distribution - keys in first, second-highest, and highest priorities only',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 320,
        capacity: 900,
      },
      operatorInfo: {
        depositableValidatorsCount: 22,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [1, 80],
            [2, 60],
          ],
          [], // Priority 1 - empty
          [], // Priority 2 - empty
          [], // Priority 3 - empty
          [
            // Priority 4
            [3, 70],
            [1, 50],
          ],
          [
            // Priority 5
            [4, 40],
            [1, 20],
          ],
        ],
      },
    },
  },
  {
    title: 'Near Capacity Limit with Uneven Distribution',
    description:
      'Very tight capacity limit (5 keys room) with most keys in highest priority',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 106, // 1+2+1+2+100 = 106 total queue keys
        capacity: 205, // Only 5 keys room left
      },
      operatorInfo: {
        depositableValidatorsCount: 8,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [], // Priority 0 - empty
          [
            // Priority 1
            [2, 1], // 1 key
          ],
          [
            // Priority 2
            [3, 2], // 2 keys
          ],
          [
            // Priority 3
            [4, 1], // 1 key
          ],
          [
            // Priority 4
            [5, 2], // 2 keys
          ],
          [
            // Priority 5
            [1, 50],
            [6, 40],
            [7, 10], // 100 keys total
          ],
        ],
      },
    },
  },
  {
    title: 'Multiple Priorities Crossing CSM Limit',
    description: 'Some priority levels under limit, others over CSM capacity',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 400,
        queue: 500,
        capacity: 600, // Only 200 more capacity
      },
      operatorInfo: {
        depositableValidatorsCount: 22,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0 - under limit
            [1, 60],
            [2, 40],
          ],
          [
            // Priority 1 - under limit
            [3, 50],
            [1, 50],
          ],
          [
            // Priority 2 - crosses limit boundary
            [4, 80],
            [5, 70],
          ],
          [
            // Priority 3 - over limit
            [1, 60],
            [6, 40],
          ],
          [
            // Priority 4 - over limit
            [7, 50],
          ],
          [], // Priority 5 - empty
        ],
      },
    },
  },
  {
    title: 'Single Operator Across Multiple Priorities',
    description:
      'One operator has validator batches across different priority levels',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 350,
        queue: 450,
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 45,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [2, 30],
            [1, 25],
            [3, 20], // Operator 1 has 25 keys
          ],
          [
            // Priority 1
            [1, 40],
            [4, 35], // Operator 1 has 40 keys
          ],
          [
            // Priority 2
            [5, 50], // Operator 1 has no keys
          ],
          [
            // Priority 3
            [1, 60],
            [6, 30],
            [1, 20], // Operator 1 has 80 keys
          ],
          [
            // Priority 4
            [7, 45],
            [1, 35], // Operator 1 has 35 keys
          ],
          [
            // Priority 5
            [8, 40],
            [9, 30], // Operator 1 has no keys
          ],
        ],
      },
    },
  },
  {
    title: 'One Key Per Priority Level',
    description:
      'Each priority level contains exactly one validator for minimum width testing',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 100,
        queue: 6, // 1 key per priority
        capacity: 200,
      },
      operatorInfo: {
        depositableValidatorsCount: 3,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [[1, 1]], // Priority 0 - 1 key
          [[2, 1]], // Priority 1 - 1 key
          [[3, 1]], // Priority 2 - 1 key
          [[4, 1]], // Priority 3 - 1 key
          [[5, 1]], // Priority 4 - 1 key
          [[6, 1]], // Priority 5 - 1 key
        ],
      },
    },
  },
  {
    title: 'Queue Sum Mismatch with ShareLimit',
    description:
      'Batch totals differ from shareLimit.queue value to test coefficient calculation',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 400, // Actual count
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 20,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          // Batches that sum to 500 (mismatch with shareLimit.queue)
          [
            // Priority 0
            [1, 100],
            [2, 80],
          ],
          [
            // Priority 1
            [3, 120],
            [4, 100],
          ],
          [
            // Priority 2
            [5, 60],
            [6, 40],
          ],
        ],
      },
    },
  },
  {
    title: 'Fallback: Empty Queue Data',
    description:
      'Empty queue batches array triggers fallback to general queue display',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 180,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 15,
      },
      formData: {
        depositDataLength: 5,
      },
      depositQueueBatches: {
        queues: [], // Empty queues array - triggers fallback
      },
    },
  },
  {
    title: 'Fallback: Null Queue Data',
    description:
      'Null queue data simulates failed analysis, triggers fallback mode',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 200,
        capacity: 900,
      },
      operatorInfo: {
        depositableValidatorsCount: 12,
      },
      formData: {
        depositDataLength: 8,
      },
      depositQueueBatches: null, // Null data - triggers fallback
    },
  },
  {
    title: 'Fallback: Over Limit Queue',
    description: 'Fallback mode with queue exceeding CSM capacity limit',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 400,
        queue: 350, // 250 over limit (400 + 350 = 750, capacity = 600)
        capacity: 600, // Only 200 more capacity available
      },
      operatorInfo: {
        depositableValidatorsCount: 25,
      },
      formData: {
        depositDataLength: 12, // Keys being added
      },
      depositQueueBatches: {
        queues: [], // Empty queues array - triggers fallback with over-limit scenario
      },
    },
  },

  // Additional Edge Case Scenarios
  {
    title: 'Queue Only - No Active Keys',
    description:
      'Zero active validators, all validators queued across multiple priorities',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 0, // No active keys
        queue: 400,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 20,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [1, 80],
            [2, 60],
          ],
          [
            // Priority 1
            [3, 50],
            [1, 40],
          ],
          [
            // Priority 2
            [4, 70],
            [5, 50],
          ],
          [
            // Priority 3
            [1, 30],
            [6, 20],
          ],
        ],
      },
    },
  },
  {
    title: 'Keys Only in Priority 4 and 5',
    description:
      'Empty lower priorities (0-3), validators only in highest priorities',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 250,
        capacity: 700,
      },
      operatorInfo: {
        depositableValidatorsCount: 15,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [], // Priority 0 - empty
          [], // Priority 1 - empty
          [], // Priority 2 - empty
          [], // Priority 3 - empty
          [
            // Priority 4
            [1, 60],
            [2, 50],
            [3, 40],
          ],
          [
            // Priority 5
            [4, 45],
            [1, 35],
            [5, 20],
          ],
        ],
      },
    },
  },
  {
    title: 'Keys Only in Highest Priority',
    description:
      'All validators concentrated in priority 5, other priorities empty',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 150,
        queue: 180,
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 12,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [], // Priority 0 - empty
          [], // Priority 1 - empty
          [], // Priority 2 - empty
          [], // Priority 3 - empty
          [], // Priority 4 - empty
          [
            // Priority 5 - only priority with keys
            [1, 80],
            [2, 60],
            [3, 40],
          ],
        ],
      },
    },
  },

  // Test cases with operator batches at the end and near end of queue segments
  {
    title: 'Operator as Last Batch in Segments',
    description: 'Operator batches positioned at the end of queue segments',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 350,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 25,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [2, 70],
            [3, 50],
            [4, 40],
            [1, 60], // Operator 1 at the end
          ],
          [
            // Priority 1
            [5, 45],
            [6, 35],
            [1, 30], // Operator 1 at the end
          ],
          [
            // Priority 2
            [7, 55],
            [8, 25], // No operator 1 keys
          ],
        ],
      },
    },
  },
  {
    title: 'Operator as Second-to-Last Batch',
    description: 'Operator batches positioned second-to-last in queue segments',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 320,
        capacity: 750,
      },
      operatorInfo: {
        depositableValidatorsCount: 30,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [2, 60],
            [3, 40],
            [1, 50],
            [4, 30], // Operator 1 second-to-last
          ],
          [
            // Priority 1
            [5, 45],
            [1, 40],
            [6, 25], // Operator 1 second-to-last
          ],
          [
            // Priority 2
            [7, 30], // Only one batch
          ],
        ],
      },
    },
  },
  {
    title: 'Operator at Various End Positions',
    description:
      'Operator batches at different end positions across priority levels',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 400,
        queue: 450,
        capacity: 1000,
      },
      operatorInfo: {
        depositableValidatorsCount: 35,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [2, 80],
            [3, 60],
            [1, 70], // Operator 1 at the end
          ],
          [
            // Priority 1
            [4, 50],
            [1, 45],
            [5, 35], // Operator 1 second-to-last
          ],
          [
            // Priority 2
            [6, 40],
            [7, 30],
            [8, 25],
            [1, 35], // Operator 1 at the end
          ],
          [
            // Priority 3
            [9, 20], // No operator 1 keys
          ],
        ],
      },
    },
  },
  {
    title: 'End Position Batches Beyond Limit',
    description:
      'Operator batches at segment ends extending beyond CSM capacity',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 450,
        queue: 380,
        capacity: 600, // Only 150 more capacity
      },
      operatorInfo: {
        depositableValidatorsCount: 28,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0 - under limit
            [2, 50],
            [3, 40],
            [1, 30], // Operator 1 at the end, under limit
          ],
          [
            // Priority 1 - crosses limit
            [4, 45],
            [1, 35], // Operator 1 at the end, crosses limit boundary
          ],
          [
            // Priority 2 - over limit
            [5, 60],
            [6, 40],
            [1, 50], // Operator 1 at the end, over limit
          ],
          [
            // Priority 3 - over limit
            [7, 35],
            [1, 40],
            [8, 25], // Operator 1 second-to-last, over limit
          ],
        ],
      },
    },
  },
  {
    title: 'Operator as Only Batch in Segments',
    description: 'Priority segments where operator is the sole batch',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 200,
        queue: 180,
        capacity: 500,
      },
      operatorInfo: {
        depositableValidatorsCount: 20,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [2, 40],
            [3, 35],
          ],
          [
            // Priority 1
            [1, 50], // Operator 1 is the only batch
          ],
          [
            // Priority 2
            [4, 30],
            [5, 25],
          ],
          [
            // Priority 3
            [1, 45], // Operator 1 is the only batch
          ],
          [], // Priority 4 - empty
          [
            // Priority 5
            [1, 30], // Operator 1 is the only batch
          ],
        ],
      },
    },
  },
  {
    title: 'End Position While Adding Keys',
    description:
      'Operator batches at segment ends with new keys being submitted',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 300,
        queue: 280,
        capacity: 700,
      },
      operatorInfo: {
        depositableValidatorsCount: 22,
      },
      formData: {
        depositDataLength: 15, // Adding 15 new keys
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [2, 60],
            [3, 45],
            [1, 55], // Operator 1 at the end
          ],
          [
            // Priority 1
            [4, 40],
            [1, 50],
            [5, 30], // Operator 1 second-to-last
          ],
          [
            // Priority 2
            [6, 35],
            [7, 25],
            [1, 40], // Operator 1 at the end
          ],
        ],
      },
    },
  },
  {
    title: 'End Positions in Sparse Priorities',
    description:
      'Operator batches at ends of sparse priority level distribution',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 150,
        queue: 220,
        capacity: 600,
      },
      operatorInfo: {
        depositableValidatorsCount: 18,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0
            [2, 50],
            [1, 40], // Operator 1 at the end
          ],
          [], // Priority 1 - empty
          [
            // Priority 2
            [3, 35],
            [4, 30],
            [1, 45], // Operator 1 at the end
          ],
          [], // Priority 3 - empty
          [], // Priority 4 - empty
          [
            // Priority 5
            [5, 25],
            [1, 35],
            [6, 15], // Operator 1 second-to-last
          ],
        ],
      },
    },
  },
  {
    title: 'All Keys in Priority 0 - Operator Last',
    description: 'All validators in priority 0 with operator batch at the end',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 300,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 25,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0 - all keys here
            [2, 80],
            [3, 70],
            [4, 60],
            [5, 50],
            [1, 40], // Operator 1 at the very end
          ],
          [], // Priority 1 - empty
          [], // Priority 2 - empty
          [], // Priority 3 - empty
          [], // Priority 4 - empty
          [], // Priority 5 - empty
        ],
      },
    },
  },
  {
    title: 'All Keys in Priority 0 - Operator at End',
    description:
      'All validators concentrated in priority 0 with operator batch at the very end',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 300,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 1,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [
            // Priority 0 - all keys here
            [2, 80],
            [3, 70],
            [4, 60],
            [5, 50],
            [5, 39],
            [1, 1], // Operator 1 at the very end
          ],
          [], // Priority 1 - empty
          [], // Priority 2 - empty
          [], // Priority 3 - empty
          [], // Priority 4 - empty
          [], // Priority 5 - empty
        ],
      },
    },
  },
  {
    title: 'All Keys in Priority 4 and 5 - Operator at End',
    description:
      'Validators only in highest priorities with operator batches at the end',
    data: {
      nodeOperatorId: 1,
      shareLimit: {
        active: 250,
        queue: 300,
        capacity: 800,
      },
      operatorInfo: {
        depositableValidatorsCount: 2,
      },
      formData: {
        depositDataLength: 0,
      },
      depositQueueBatches: {
        queues: [
          [], // Priority 0 - empty
          [], // Priority 1 - empty
          [], // Priority 2 - empty
          [], // Priority 3 - empty
          [
            [5, 38],
            [1, 1],
          ], // Priority 4 - empty
          [
            // Priority 5 - all keys here
            [2, 80],
            [3, 70],
            [4, 60],
            [5, 50],
            [1, 1],
          ],
        ],
      },
    },
  },
];

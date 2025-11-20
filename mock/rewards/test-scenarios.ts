import { MockScenarioData } from './mock-data';
import { data } from './data';

export type TestScenario = {
  title: string;
  description: string;
  data: MockScenarioData;
};

export const testScenarios: TestScenario[] = [
  {
    title: 'Full Dataset',
    description: 'All rewards history data from mock',
    data: {
      nodeOperatorId: 1,
      rewardsHistory: data,
    },
  },
  {
    title: 'Small Dataset (First 10)',
    description: 'Limited view with first 10 reward records',
    data: {
      nodeOperatorId: 1,
      rewardsHistory: data.slice(0, 10),
    },
  },
  {
    title: 'Medium Dataset (First 50)',
    description: 'Medium-sized dataset with 50 reward records',
    data: {
      nodeOperatorId: 1,
      rewardsHistory: data.slice(0, 50),
    },
  },
  {
    title: 'High Performance Only',
    description: 'Only validators with performance >= 0.99',
    data: {
      nodeOperatorId: 1,
      rewardsHistory: data.filter((record) => record.performance >= 0.99),
    },
  },
  {
    title: 'Below Threshold Performance',
    description: 'Validators performing below threshold',
    data: {
      nodeOperatorId: 1,
      rewardsHistory: data.filter(
        (record) => record.performance < record.threshold,
      ),
    },
  },
  {
    title: 'Single Validator',
    description: 'Single validator view',
    data: {
      nodeOperatorId: 1,
      rewardsHistory: data.slice(0, 1),
    },
  },
  {
    title: 'Empty State',
    description: 'No rewards history - empty state',
    data: {
      nodeOperatorId: 1,
      rewardsHistory: [],
    },
  },
  {
    title: 'Recent Rewards (Last 20)',
    description: 'Most recent reward records',
    data: {
      nodeOperatorId: 1,
      rewardsHistory: data.slice(-20),
    },
  },
];

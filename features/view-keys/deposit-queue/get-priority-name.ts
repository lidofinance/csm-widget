import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { GraphPart } from './types';

const CSM_02_NAMES: Partial<Record<GraphPart, string>> = {
  active: 'Active stake',
  queue: 'Queued stake',
  queueOverLimit: 'Queued stake (over limit)',
};

export const getPriorityName = (type: GraphPart, module?: MODULE_NAME) => {
  if (module === MODULE_NAME.CSM_02 && CSM_02_NAMES[type]) {
    return CSM_02_NAMES[type];
  }

  switch (type) {
    case 'active':
      return 'Active keys';
    case 'batch':
      return 'Your queued keys';
    case 'added':
      return 'Keys you’re trying to submit';
    case 'limit':
      return 'CSM stake limit';
    case 'queue':
      return 'Queued keys';
    case 'queueOverLimit':
      return 'Queued keys (over limit)';
    case 'priority0':
      return 'Priority queue';
    case 'priority1':
      return 'Priority 2 queue';
    case 'priority2':
      return 'Priority 3 queue';
    case 'priority3':
      return 'Priority 4 queue';
    case 'priority4':
      return 'Priority 5 queue';
    case 'priority5':
      return 'General queue';
    case 'priority0OverLimit':
      return 'Priority queue (over limit)';
    case 'priority1OverLimit':
      return 'Priority 2 queue (over limit)';
    case 'priority2OverLimit':
      return 'Priority 3 queue (over limit)';
    case 'priority3OverLimit':
      return 'Priority 4 queue (over limit)';
    case 'priority4OverLimit':
      return 'Priority 5 queue (over limit)';
    case 'priority5OverLimit':
      return 'General queue (over limit)';
    default:
      return 'Unknown';
  }
};

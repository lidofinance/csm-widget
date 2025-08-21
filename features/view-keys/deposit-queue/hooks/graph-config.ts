export const GRAPH_CONFIG = {
  QUEUE: {
    POTENTIAL_ADDED: 25n,
    BACK_OFFSET: 30n,
  },
  VIEW: {
    MIN_SIZE_PERCENTAGE: {
      FULL: 0.5,
      NORMAL: 1,
    },
    BOUNDS: {
      LEFT_MARGIN: 15,
      RIGHT_MARGIN: 85,
      FULL_WIDTH: 95,
    },
  },
} as const;

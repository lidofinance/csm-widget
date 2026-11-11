type StakeBarScaleInput = {
  active: number;
  depositable: number;
  target: number;
  weightZero?: boolean;
};

export const getStakeBarScale = ({
  active,
  depositable,
  target,
  weightZero,
}: StakeBarScaleInput): { max: number; limit?: number } => {
  const showLimit = target > 0 && !weightZero;
  const max = Math.max(target, active + depositable, 1) * 1.1;
  return showLimit ? { max, limit: target } : { max };
};

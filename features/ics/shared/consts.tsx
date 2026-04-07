import { format } from 'date-fns';

type IcsRound = {
  round: number;
  start: Date;
  assessedDate: string;
};

export const ICS_ROUNDS: IcsRound[] = [
  {
    round: 4,
    start: new Date(`2026-01-22`),
    assessedDate: `Q1-Q2\u00A02026`,
  },
  {
    round: 5,
    start: new Date(`2026-04-14`),
    assessedDate: `late Q2, or Q3 2026`,
  },
];

const formatIcsRoundDate = (date: Date) => format(date, 'MMMM\u00A0dd, yyyy');

const getCurrentRound = () => {
  const now = new Date();
  const current =
    ICS_ROUNDS.findLast((round) => now >= round.start) ||
    ICS_ROUNDS[ICS_ROUNDS.length - 1];
  const next = ICS_ROUNDS.find(({ round }) => round === current.round + 1);

  return {
    ...current,
    startDate: formatIcsRoundDate(current.start),
    assessedDate: next ? formatIcsRoundDate(next.start) : current.assessedDate,
    isPreciseAssessedDate: !!next,
  };
};

export const ICS_ROUND = getCurrentRound();

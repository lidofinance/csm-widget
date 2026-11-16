import { format } from 'date-fns';

export const formatSentOn = (date: Date | string | number) =>
  `Sent on ${format(new Date(date), 'MMM d, yyyy')}`;

import { Button } from '@lidofinance/lido-ui';
import { FC } from 'react';

type SurveyButtonProps = React.ComponentProps<typeof Button> & {
  title: string;
};

export const SurveyButton: FC<SurveyButtonProps> = ({ title, ...props }) => {
  return (
    <Button variant="outlined" size="sm" {...props}>
      {title}
    </Button>
  );
};

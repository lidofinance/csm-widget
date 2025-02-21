import { Button } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';

type SurveyLinkProps = React.ComponentProps<typeof Button> & {
  title: string;
  filled?: boolean;
  path: string;
};

export const SurveyLink: FC<SurveyLinkProps> = ({ title, path, ...props }) => {
  return (
    <LocalLink href={path as any}>
      <Button variant="outlined" size="sm" {...props}>
        {title}
      </Button>
    </LocalLink>
  );
};

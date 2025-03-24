import { Button, ButtonIcon } from '@lidofinance/lido-ui';
import { ComponentProps, FC } from 'react';
import { LocalLink } from 'shared/navigate';

type SurveyLinkProps = React.ComponentProps<typeof Button> & {
  filled?: boolean;
  icon?: ComponentProps<typeof ButtonIcon>['icon'];
  path: string;
};

export const SurveyLink: FC<SurveyLinkProps> = ({ icon, path, ...props }) => {
  return (
    <LocalLink href={path as any}>
      {icon ? (
        <ButtonIcon icon={icon} variant="outlined" size="sm" {...props} />
      ) : (
        <Button variant="outlined" size="sm" {...props} />
      )}
    </LocalLink>
  );
};

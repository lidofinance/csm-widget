import { ArrowLeft, ButtonIcon } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { useSurveyContext } from '../surveys-provider';

type DelegatorBackButtonProps = {
  operatorId?: string;
};

export const DelegatorBackButton: FC<DelegatorBackButtonProps> = ({
  operatorId,
}) => {
  const { isOperator } = useSurveyContext();

  const href = operatorId
    ? (`${PATH.SURVEYS_DELEGATOR}/${operatorId}` as PATH)
    : isOperator
      ? PATH.SURVEYS_DELEGATOR
      : PATH.SURVEYS;

  return (
    <LocalLink href={href}>
      <ButtonIcon
        variant="ghost"
        color="secondary"
        size="xs"
        icon={<ArrowLeft />}
      >
        Back
      </ButtonIcon>
    </LocalLink>
  );
};

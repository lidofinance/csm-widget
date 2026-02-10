import { PATH } from 'consts/urls';
import { FC } from 'react';
import { BackButton } from 'shared/components';
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

  return <BackButton href={href} color="secondary" />;
};

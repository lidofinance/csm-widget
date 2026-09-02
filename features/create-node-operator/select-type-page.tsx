import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { CREATE_PATH_BY_TYPE } from 'consts/urls';
import { FC } from 'react';
import { useCanCreateNodeOperator, useHasUnconsumedProof } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { CardsGrid } from './operator-type-modal/styles';
import { TypeCard } from './operator-type-modal/type-card';
import type { VisibleType } from './operator-type-modal/use-visible-types';

const MATOMO_EVENT_BY_TYPE: Partial<
  Record<OPERATOR_TYPE, MATOMO_CLICK_EVENTS_TYPES>
> = {
  [OPERATOR_TYPE.CSM_DEF]:
    MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless,
  [OPERATOR_TYPE.CSM_ICS]: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIcs,
  [OPERATOR_TYPE.CSM_IDVTC]:
    MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIdvtc,
  [OPERATOR_TYPE.CSM2_DEF]:
    MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinCsm02,
};

const isCreatableWithPath = (
  type: OPERATOR_TYPE,
): type is keyof typeof CREATE_PATH_BY_TYPE => type in CREATE_PATH_BY_TYPE;

export const SelectTypePage: FC = () => {
  const { creatableTypes } = useCanCreateNodeOperator();
  const hasUnconsumedProof = useHasUnconsumedProof();

  const cards = creatableTypes
    .filter((type) => type !== OPERATOR_TYPE.CSM_DEF || !hasUnconsumedProof)
    .filter(isCreatableWithPath)
    .map((type): VisibleType | null => {
      const matomoEvent = MATOMO_EVENT_BY_TYPE[type];
      if (!matomoEvent) return null;
      return {
        type,
        href: CREATE_PATH_BY_TYPE[type],
        label: 'Join now',
        matomoEvent,
        primary: true,
      };
    })
    .filter((card): card is VisibleType => card !== null);

  return (
    <Layout
      title="Create a Node Operator"
      subtitle="Choose the operator type to create"
      pageName="SelectOperatorType"
    >
      <CardsGrid $columns={cards.length}>
        {cards.map((card) => (
          <TypeCard key={card.type} type={card} />
        ))}
      </CardsGrid>
    </Layout>
  );
};

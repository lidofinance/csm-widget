import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useOperatorTypeModal } from 'features/create-node-operator/operator-type-modal/operator-type-modal';
import { useShouldShowTypeModal } from 'features/create-node-operator/operator-type-modal/use-should-show-type-modal';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';

export const CreateOperatorButton: FC = () => {
  const shouldShowModal = useShouldShowTypeModal();
  const { openModal } = useOperatorTypeModal();

  return (
    <>
      {shouldShowModal ? (
        <Button fullwidth onClick={() => openModal({})}>
          Create Node Operator
        </Button>
      ) : (
        <LocalLink
          href={PATH.CREATE}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackCreateNodeOperator}
        >
          <Button fullwidth>Create Node Operator</Button>
        </LocalLink>
      )}
    </>
  );
};

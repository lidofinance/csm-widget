import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import {
  useOperatorTypeModal,
  useShouldShowTypeModal,
} from './operator-type-modal';

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

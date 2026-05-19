import { FC, useEffect } from 'react';
import { useOperatorTypeModal } from './operator-type-modal';
import { useShouldShowTypeModal } from './use-should-show-type-modal';

export const OperatorTypeModalOpener: FC = () => {
  const shouldShow = useShouldShowTypeModal();
  const { openModal } = useOperatorTypeModal();

  useEffect(() => {
    if (shouldShow) openModal({});
  }, [shouldShow, openModal]);

  return null;
};

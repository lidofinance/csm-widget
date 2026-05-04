import { FC, PropsWithChildren } from 'react';
import { useWatch } from 'react-hook-form';
import { FormLoader } from 'shared/hook-form/form-controller';
import { SplitsFormInputType } from './context';
import { ViewSplits } from './controls/view-splits';

export const SplitsFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const isEditing = useWatch<SplitsFormInputType, 'isEditing'>({
    name: 'isEditing',
  });

  return <FormLoader>{isEditing ? children : <ViewSplits />}</FormLoader>;
};

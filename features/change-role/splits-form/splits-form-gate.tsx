import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { FormCardStackStyle } from '../shared/styles';
import { SplitsFormInputType } from './context';
import { EditSplits } from './controls/edit-splits';
import { ViewSplits } from './controls/view-splits';

export const SplitsFormGate: FC = () => {
  const isEditing = useWatch<SplitsFormInputType, 'isEditing'>({
    name: 'isEditing',
  });

  return (
    <Stack gap={24} data-testid="splitsForm">
      {isEditing ? (
        <FormCardStackStyle>
          <EditSplits />
        </FormCardStackStyle>
      ) : (
        <ViewSplits />
      )}
    </Stack>
  );
};

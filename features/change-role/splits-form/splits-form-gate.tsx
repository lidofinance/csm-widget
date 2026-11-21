import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { Form } from 'shared/hook-form/form-controller';
import s from '../shared/styles.module.css';
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
        <Form className={s.formCardStack}>
          <EditSplits />
        </Form>
      ) : (
        <ViewSplits />
      )}
    </Stack>
  );
};

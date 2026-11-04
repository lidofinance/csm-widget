import { SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { KeyListField } from 'shared/hook-form/fields';
import { useRemoveKeysFormData } from '../context';
import {
  getRemoveKeyTags,
  SEQUENTIAL_HINT,
  showSequentialHint,
} from '../remove-keys-state';
import { HintStyle } from '../styles';

export const KeysSelector: FC = () => {
  const { keys } = useRemoveKeysFormData(true);

  return (
    <Stack direction="column" gap={16}>
      <SectionTitle title="Choose keys to remove" />
      <KeyListField
        name="selection"
        mode="range"
        options={keys}
        aria-label="Keys to remove"
        getTags={getRemoveKeyTags}
        data-testid="removeKeysList"
      />
      {showSequentialHint(keys.length) && (
        <HintStyle variant="description" forwardedAs="p">
          {SEQUENTIAL_HINT}
        </HintStyle>
      )}
    </Stack>
  );
};

import {
  MessageBox,
  SectionTitle,
  Stack,
  TextLink,
} from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { useDeleteMode } from 'features/delete-keys/delete-mode-provider';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { KeyListField } from 'shared/hook-form/fields';
import { useEjectKeysFormData } from '../context';
import {
  isNotEjectableKey,
  NOT_EJECTABLE_HINT,
  NOT_NORMAL_EXIT_HEADLINE,
} from '../eject-keys-state';

const NotNormalExitNotice: FC = () => {
  const { isCsmFamily } = useModule();
  const { setMode } = useDeleteMode();

  return (
    <MessageBox variant="info" headline={NOT_NORMAL_EXIT_HEADLINE}>
      This functionality should be used only as a last resort to exit your keys
      by utilizing the Execution Layer Triggerable Withdrawals (which includes
      additional network fees). You might need to use this method in case you
      don’t have an ability to access your validator keys. If you can exit your
      keys normally, please proceed with the{' '}
      {isCsmFamily ? (
        <TextLink
          href={`${PATH.KEYS_DELETE}?mode=exit`}
          onClick={(e) => {
            e.preventDefault();
            setMode('exit');
          }}
        >
          regular exit flow
        </TextLink>
      ) : (
        'regular exit flow'
      )}
      .
    </MessageBox>
  );
};

export const KeysSelector: FC = () => {
  const { keys } = useEjectKeysFormData(true);

  return (
    <Stack direction="column" gap={32}>
      <NotNormalExitNotice />
      <Stack direction="column" gap={16}>
        <SectionTitle title="Choose keys to eject" />
        <KeyListField
          name="selection"
          mode="multi"
          options={keys}
          aria-label="Keys to eject"
          isDisabled={isNotEjectableKey}
          disabledHint={NOT_EJECTABLE_HINT}
          data-testid="ejectKeysList"
        />
      </Stack>
    </Stack>
  );
};

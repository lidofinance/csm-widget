import { PATH } from 'consts';
import { FormTitle, WarningBlock } from 'shared/components';
import { EjectKeysSelectorHookForm } from 'shared/hook-form/controls';
import { LocalLink } from 'shared/navigate';
import { useEjectKeysFormData } from '../context';

export const KeysSelector = () => {
  const { keys } = useEjectKeysFormData(true);

  return (
    <>
      <WarningBlock>
        This <b>is not</b> the normal exit flow. This functionality should be
        used only as a last resort to exit your keys by utilizing the Execution
        Layer Triggerable Withdrawals (which includes additional network fees).
        You might need to use this method in case you don’t have an ability to
        access your validator keys. If you can exit your keys normally, please
        proceed with{' '}
        <LocalLink href={PATH.KEYS_EXIT}>the regular exit flow</LocalLink>.
      </WarningBlock>
      <FormTitle>Choose keys to eject</FormTitle>
      <EjectKeysSelectorHookForm options={keys} />
    </>
  );
};

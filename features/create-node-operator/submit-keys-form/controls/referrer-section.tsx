import { Disclosure, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { REF_MAPPING } from 'consts/ref-mapping';
import { useModifyContext } from 'providers/modify-provider';
import { FC, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AddressField } from 'shared/hook-form/fields';
import { useShowRule } from 'shared/hooks';
import { compareLowercase } from 'utils';
import { SubmitKeysFormInputType } from '../context';
import { useConfirmRemoveReferrerModal } from '../hooks/use-confirm-modal';

export const ReferrerSection: FC = () => {
  const check = useShowRule();
  const { referrer: modifyReferrer } = useModifyContext();
  const { setValue } = useFormContext<SubmitKeysFormInputType>();
  const referrer = useWatch<SubmitKeysFormInputType, 'referrer'>({
    name: 'referrer',
  });
  const confirmRemove = useConfirmRemoveReferrerModal();
  const [open, setOpen] = useState(true);

  const refName = REF_MAPPING.find(({ address }) =>
    compareLowercase(address, modifyReferrer),
  )?.name;

  if (!check('HAS_REFERRER')) return null;

  const handleOpenChange = async (next: boolean) => {
    if (next) {
      setValue('referrer', modifyReferrer);
      setOpen(true);
      return;
    }
    if (!referrer || (await confirmRemove({}))) {
      setValue('referrer', undefined);
      setOpen(false);
    }
  };

  return (
    <Disclosure
      label={open ? 'Do not specify a referrer' : 'Specify a referrer'}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Stack direction="column" gap={16} align="stretch">
        <SectionTitle title="Specify a referrer" />
        <AddressField
          name="referrer"
          label="Referrer address"
          addressName={refName}
          disabled
        />
      </Stack>
    </Disclosure>
  );
};

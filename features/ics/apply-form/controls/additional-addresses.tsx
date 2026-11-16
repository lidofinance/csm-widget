import { Button, IconPlus, Stack, TextLink } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ApplySection, GuideLink } from 'shared/node-operator/type-apply';
import { trackMatomoEvent } from 'utils';
import { MAX_ADDITIONAL_ADDRESSES, type ApplyFormInputType } from '../context';
import { AddressItem } from './address-item';
import { ETHERSCAN_SIGNATURES_URL } from './consts';

export const AdditionalAddresses: FC = () => {
  const { control } = useFormContext<ApplyFormInputType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalAddresses',
  });

  const handleAddAddress = useCallback(() => {
    if (fields.length < MAX_ADDITIONAL_ADDRESSES) {
      append({ address: '', signature: '' });
    }
  }, [append, fields.length]);

  return (
    <ApplySection
      title="Additional addresses"
      action={
        <GuideLink
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.icsYoutubeGuideLink}
        />
      }
      subtitle={
        <>
          You can add up to {MAX_ADDITIONAL_ADDRESSES} addresses where your
          achievements are stored. To prove you own each address, sign a message
          via the{' '}
          <TextLink
            external
            size="inherit"
            href={ETHERSCAN_SIGNATURES_URL}
            onClick={() =>
              trackMatomoEvent(
                MATOMO_CLICK_EVENTS_TYPES.icsEtherscanSignaturesLink,
              )
            }
          >
            verification page
          </TextLink>
          .
        </>
      }
      data-testid="additionalAddressesSection"
    >
      {fields.length > 0 && (
        <Stack gap={24}>
          {fields.map((field, index) => (
            <AddressItem key={field.id} index={index} onRemove={remove} />
          ))}
        </Stack>
      )}

      {fields.length < MAX_ADDITIONAL_ADDRESSES && (
        <div>
          <Button
            type="button"
            variant="outline"
            size="small"
            iconLeft={<IconPlus />}
            onClick={handleAddAddress}
            dataTestId={{ root: 'addNewAddressBtn' }}
          >
            Add new address
          </Button>
        </div>
      )}
    </ApplySection>
  );
};

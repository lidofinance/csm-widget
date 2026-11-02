import { CM_BOND_AMOUNTS_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { getBondTokenOptions, TokenSelectField } from 'shared/hook-form/fields';
import { LocalLink } from 'shared/navigate';
import { useAddKeysFormData } from '../context';

const HowBondIsCalculatedLink: FC = () => {
  const { isCsmFamily } = useModule();

  return isCsmFamily ? (
    <LocalLink
      href={PATH.KEYS_SUBMIT}
      anchor="#how-much-bond-is-needed"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
    >
      How bond is calculated
    </LocalLink>
  ) : (
    <MatomoLink
      href={CM_BOND_AMOUNTS_LINK}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
    >
      How bond is calculated
    </MatomoLink>
  );
};

export const TokenSelect: FC = () => {
  const { ethBalance, stethBalance, wstethBalance, keysAvailable } =
    useAddKeysFormData(true);

  return (
    <TokenSelectField
      name="token"
      label="Choose bond token"
      action={<HowBondIsCalculatedLink />}
      options={getBondTokenOptions({
        ethBalance,
        stethBalance,
        wstethBalance,
        keysAvailable,
      })}
    />
  );
};

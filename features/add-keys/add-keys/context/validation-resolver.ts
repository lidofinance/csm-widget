import invariant from 'tiny-invariant';
import {
  handleResolverValidationError,
  ValidationError,
} from 'shared/hook-form/validation/validation-error';
import { awaitWithTimeout } from 'utils/await-with-timeout';
import type { Resolver } from 'react-hook-form';
import type { AddKeysFormInputType, AddKeysFormNetworkData } from './types';
import { DataContext, VALIDATION_CONTEXT_TIMEOUT } from './use-context-promise';
import { getTokenDisplayName } from 'utils';
import { TOKENS } from 'consts/tokens';
import { validateDepositData } from 'shared/keys';

// TODO: same for addKey, addBond

export const validationResolver: Resolver<
  AddKeysFormInputType,
  DataContext<AddKeysFormNetworkData>
> = async (values, validationContextPromise) => {
  const { token, bondAmount, depositData } = values;
  try {
    invariant(
      validationContextPromise,
      'validation context must be presented as context promise',
    );

    const {
      stethBalance,
      wstethBalance,
      etherBalance,
      maxStakeEther,
      wc,
      chainId,
    } = await awaitWithTimeout(
      validationContextPromise,
      VALIDATION_CONTEXT_TIMEOUT,
    );

    if (bondAmount?.gt(0)) {
      if (
        (token === TOKENS.ETH && etherBalance?.lt(bondAmount)) ||
        (token === TOKENS.STETH && stethBalance?.lt(bondAmount)) ||
        (token === TOKENS.WSTETH && wstethBalance?.lt(bondAmount))
      ) {
        throw new ValidationError(
          'bondAmount',
          `not enought balance of ${getTokenDisplayName(token)}`,
        );
      }

      if (token === TOKENS.ETH && maxStakeEther?.lt(bondAmount)) {
        throw new ValidationError(
          'bondAmount',
          `Lido is reach staking limit - use another token or try later`,
        ); // TODO: text
      }
    }

    // TODO: validate `targetLimit` and `eaLimit`

    invariant(chainId);
    invariant(wc);
    const error = validateDepositData(depositData, chainId, wc);
    if (error) {
      throw new ValidationError('depositData', error.message);
    }

    return {
      values,
      errors: {},
    };
  } catch (error) {
    return handleResolverValidationError(error, 'SubmitKeysForm', 'referral');
  }
};

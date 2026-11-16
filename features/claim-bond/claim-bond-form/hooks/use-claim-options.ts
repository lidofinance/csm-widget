import { useWatch } from 'react-hook-form';
import {
  ClaimOptionView,
  describeClaimOption,
  getClaimOptionContext,
  getClaimOptionViews,
} from '../claim-options';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';

export type ClaimOptions = {
  options: ClaimOptionView[];
  submitLabel: string;
};

export const useClaimOptions = (): ClaimOptions => {
  const { bond, feeSplits, calculation, availableOptions } =
    useClaimBondFormData(true);
  const [token, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimOption']
  >({ name: ['token', 'claimOption'] });

  const ctx = getClaimOptionContext({ calculation, bond, feeSplits });

  return {
    options: getClaimOptionViews(availableOptions, ctx, token),
    submitLabel: describeClaimOption(claimOption, ctx, token).submitLabel,
  };
};

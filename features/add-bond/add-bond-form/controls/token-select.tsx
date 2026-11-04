import { FC } from 'react';
import { getBondTokenOptions, TokenSelectField } from 'shared/hook-form/fields';
import { useAddBondFormData } from '../context';

export const TokenSelect: FC = () => {
  const { ethBalance, stethBalance, wstethBalance } = useAddBondFormData(true);

  return (
    <TokenSelectField
      name="token"
      label="Choose bond token"
      options={getBondTokenOptions({ ethBalance, stethBalance, wstethBalance })}
    />
  );
};

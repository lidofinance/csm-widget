import { BOND_EXCESS, BOND_SHORTAGE } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { FC } from 'react';
import { Latice, TitledAmount } from 'shared/components';
import { useAddBondFormData } from '../context';

export const Info: FC = () => {
  const { bond, loading } = useAddBondFormData();

  // TODO: covered/unbounded/available keys
  return (
    <>
      <Latice variant="secondary">
        <TitledAmount
          title="Bond balance"
          loading={loading.isBondLoading}
          amount={bond?.current}
          token={TOKENS.STETH}
        />
        <TitledAmount
          warning={bond?.isNoticiableShortage}
          title={bond?.isShortage ? BOND_SHORTAGE : BOND_EXCESS}
          help={
            bond?.isShortage
              ? '' // FIXME: text
              : 'The bond amount available to claim without having to exit validators'
          }
          loading={loading.isBondLoading}
          amount={bond?.delta}
          token={TOKENS.STETH}
        />
        {/* <TitledAmount
          warning
          title="Locked bond"
          help="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations."
          loading={loading.isBondLoading}
          amount={bond?.locked}
          token={TOKENS.ETH}
        /> */}
      </Latice>
    </>
  );
};

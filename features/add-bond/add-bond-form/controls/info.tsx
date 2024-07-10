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
          title={bond?.isShortage ? 'Shortage bond' : 'Excess bond'}
          help={
            bond?.isShortage
              ? '' // FIXME: text
              : 'The bond amount available to claim without having to exit validators'
          }
          loading={loading.isBondLoading}
          amount={bond?.delta}
          token={TOKENS.STETH}
        />
      </Latice>
    </>
  );
};

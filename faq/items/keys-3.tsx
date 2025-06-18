import { OPERATOR_TYPE } from 'consts';
import { FaqBondAmount, FaqCurveImage } from 'shared/components';
import { Faq } from 'types';

export const Keys3: Faq = {
  title: 'How much bond is needed?',
  anchor: 'how-much-bond-is-needed',
  content: (
    <div>
      <p>
        The initial bond requirement for the first validator for the mainnet is{' '}
        <FaqBondAmount type={OPERATOR_TYPE.PERMISSIONLESS} />. However, for
        Identified Community Stakers (ICS), this amount is reduced to{' '}
        <FaqBondAmount type={OPERATOR_TYPE.ICS} /> to incentivize independent
        stakers participation.
      </p>
      <p>
        The amount for the second and subsequent validators is{' '}
        <FaqBondAmount type={OPERATOR_TYPE.PERMISSIONLESS} second />
      </p>
      <p>For the mainnet, the values for the bond curve are the following:</p>
      <FaqCurveImage />
    </div>
  ),
};

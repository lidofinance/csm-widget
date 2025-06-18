import { FaqCurveImage, FaqLink } from 'shared/components';
import { Faq } from 'types';

export const Keys4: Faq = {
  title: 'What is the bond curve?',
  anchor: 'what-is-the-bond-curve',
  content: (
    <div>
      <p>
        <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-2d1c307d95fc4f8ab7c32b7584f795cf">
          The bond curve
        </FaqLink>{' '}
        is a function that determines the amount of bond required for each
        subsequent validator operated by the node operator. For Identified
        Community Stakers (ICS), a unique bond curve function is applied to
        independent stakers participation.
      </p>
      <p>For the mainnet, the values for the bond curve are the following:</p>
      <FaqCurveImage />
    </div>
  ),
};

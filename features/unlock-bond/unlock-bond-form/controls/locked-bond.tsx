import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useUnlockBondFormData } from '../context';
import { ActionsStyle } from '../styles';

export const LockedBondNotice: FC = () => {
  const { bond, isExpired } = useUnlockBondFormData(true);

  if (!bond?.locked) return null;

  if (isExpired) {
    return (
      <MessageBox>
        The lock period has ended. You can unlock your bond now (no compensation
        required).
      </MessageBox>
    );
  }

  return (
    <MessageBox headline="You have locked bond">
      Penalties have been applied to your Node Operator. If they aren&apos;t
      covered, the corresponding amount of your bond may be burned. See details
      in the table below.
      <ActionsStyle>
        <b>Actions required:</b>
        <ul>
          <li>
            Compensate the penalty amount to prevent the related portion of your
            bond from being burned
          </li>
          <li>
            Review the penalty details and fix the underlying issue to avoid
            additional penalties
          </li>
        </ul>
      </ActionsStyle>
    </MessageBox>
  );
};

import {
  DataList,
  DataListRow,
  MessageBox,
  Tag,
  Typography,
} from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { BOND_LOCKED } from 'consts/text';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { useUnlockBondFormData } from '../context';
import { ActionsStyle } from '../styles';

const INHERIT_FONT = { font: 'inherit' };

export const LockedBondSummary: FC = () => {
  const { bond, isExpired } = useUnlockBondFormData(true);
  const locked = bond?.locked ?? 0n;
  const amount = <FormatToken amount={locked} token={TOKENS.steth} />;

  return (
    <DataList>
      <DataListRow
        label={
          <>
            {BOND_LOCKED}
            {isExpired && locked > 0n && (
              <>
                {' '}
                <Tag variant="warning">Expired</Tag>
              </>
            )}
          </>
        }
        info="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations."
        value={
          !isExpired && locked > 0n ? (
            <Typography as="span" color="error" style={INHERIT_FONT}>
              {amount}
            </Typography>
          ) : (
            amount
          )
        }
        dataTestId={{ value: 'lockedBondAmount' }}
      />
    </DataList>
  );
};

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

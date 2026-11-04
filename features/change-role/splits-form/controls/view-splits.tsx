import { SectionTitle } from '@lidofinance/lido-app-ui';
import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormCard } from 'shared/form-page';
import { SplitsFormInputType, useSplitsFormData } from '../context';
import { getSplitsActionLabel, getSplitsNotice } from '../splits-state';
import { FullWidthButtonStyle, SectionStyle } from '../styles';
import { BondRow } from './bond-row';
import { ShareRowView } from './split-row-view';
import { SplitsNotice } from './splits-notice';

export const ViewSplits: FC = () => {
  const { setValue } = useFormContext<SplitsFormInputType>();
  const handleEdit = useCallback(() => setValue('isEditing', true), [setValue]);
  const { currentFeeSplits, canEdit, isOwner, rewards, pendingToSplit } =
    useSplitsFormData(true);

  const hasSplits = currentFeeSplits.length > 0;
  const notice = getSplitsNotice({
    canEdit,
    splitsCount: currentFeeSplits.length,
    proofLength: rewards.proof.length,
    hasAvailable: rewards.available > 0n,
    hasPendingToSplit: !!pendingToSplit,
  });

  return (
    <FormCard>
      <BondRow />

      {hasSplits && (
        <SectionStyle>
          <SectionTitle title="Additional addresses" />
          {currentFeeSplits.map((split, i) => (
            <ShareRowView
              key={split.recipient}
              label={`Additional address #${i + 1}`}
              value={split.recipient}
              share={split.share}
            />
          ))}
        </SectionStyle>
      )}

      {notice && <SplitsNotice notice={notice} />}

      {isOwner && (
        <FullWidthButtonStyle
          disabled={!canEdit}
          onClick={handleEdit}
          data-testid="splitsActionButton"
        >
          {getSplitsActionLabel(hasSplits)}
        </FullWidthButtonStyle>
      )}
    </FormCard>
  );
};

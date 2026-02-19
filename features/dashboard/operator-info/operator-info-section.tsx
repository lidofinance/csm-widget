import { PATH } from 'consts/urls';
import { useNodeOperatorId, useOperatorMetadata } from 'modules/web3';
import { FC } from 'react';
import { SectionBlock } from 'shared/components';
import { useShowRule } from 'shared/hooks';
import {
  InfoField,
  InfoFieldLabel,
  InfoFieldValue,
  PlaceholderText,
} from './styles';

export const OperatorInfoSection: FC = () => {
  const check = useShowRule();
  if (!check('IS_CM')) return null;

  return <OperatorInfoSectionContent />;
};

const OperatorInfoSectionContent: FC = () => {
  const id = useNodeOperatorId();
  const { data } = useOperatorMetadata(id);

  const canEdit = data && !data.ownerEditsRestricted;
  const isEmpty = !data?.name && !data?.description;

  return (
    <SectionBlock
      title="Operator Info"
      href={canEdit ? PATH.ROLES_OPERATOR_INFO : undefined}
    >
      {data && (
        <>
          {isEmpty ? (
            <PlaceholderText>
              No operator name or description set
            </PlaceholderText>
          ) : (
            <>
              <InfoField>
                <InfoFieldLabel>Name</InfoFieldLabel>
                <InfoFieldValue>{data.name || '—'}</InfoFieldValue>
              </InfoField>
              <InfoField>
                <InfoFieldLabel>Description</InfoFieldLabel>
                <InfoFieldValue>{data.description || '—'}</InfoFieldValue>
              </InfoField>
            </>
          )}
        </>
      )}
    </SectionBlock>
  );
};

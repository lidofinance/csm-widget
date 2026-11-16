import {
  IconArrowRight,
  Skeleton,
  TextLink,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import {
  useModule,
  useNodeOperator,
  useOperatorCurveId,
  useOperatorGroup,
  useOperatorGroupId,
  useOperatorInfo,
  useOperatorMetadata,
  OperatorRef,
} from 'modules/web3';
import { FC, ReactNode, useMemo } from 'react';
import { StretchCard } from 'shared/components';
import { useDisplayOperatorType, useShowRule } from 'shared/hooks';
import {
  OperatorAddresses,
  OperatorAvatar,
  OperatorTypeTag,
  formatGroupLabel,
  useOperatorTitle,
} from 'shared/node-operator';
import styled from 'styled-components';
import { trackMatomoEvent } from 'utils';
import { useHeaderFlags } from './hooks/use-header-flags';

const TITLE_SKELETON_STYLE = { width: 160 };

const gridAreas = (...rows: (string | false)[]) =>
  rows
    .filter(Boolean)
    .map((row) => `'${row}'`)
    .join(' ');

const HeaderGrid = styled.div<{
  $tight: boolean;
  $hasDesc: boolean;
  $hasSettings: boolean;
}>`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  grid-template-areas: ${({ $hasDesc }) =>
    gridAreas(
      'avatar title settings',
      'avatar meta meta',
      $hasDesc && 'desc desc desc',
    )};
  column-gap: 24px;
  row-gap: ${({ $tight }) => ($tight ? 8 : 12)}px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 52px minmax(0, 1fr);
    grid-template-areas: ${({ $hasDesc, $hasSettings }) =>
      gridAreas(
        'avatar title',
        $hasSettings && 'settings settings',
        'meta meta',
        $hasDesc && 'desc desc',
      )};
    column-gap: 16px;
    row-gap: 12px;
  }
`;

const AvatarArea = styled.div`
  grid-area: avatar;
  width: 72px;
  height: 72px;

  @media (max-width: 900px) {
    width: 52px;
    height: 52px;
  }
`;

const AvatarScale = styled.div`
  width: 72px;
  height: 72px;
  transform-origin: top left;

  @media (max-width: 900px) {
    transform: scale(0.7222);
  }
`;

const TitleArea = styled.div`
  grid-area: title;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    align-self: center;
  }
`;

const SettingsArea = styled.div`
  grid-area: settings;
  align-self: center;
`;

const MetaArea = styled.div`
  grid-area: meta;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  min-width: 0;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const DescriptionArea = styled.div`
  grid-area: desc;
`;

const MetaText: FC<{ testId: string; children: ReactNode }> = ({
  testId,
  children,
}) => (
  <Typography variant="body" color="tertiary" dataTestId={{ root: testId }}>
    {children}
  </Typography>
);

type HeaderProps = {
  operator: OperatorRef;
};

const OperatorHeader: FC<HeaderProps> = ({ operator }) => {
  const { nodeOperatorId, module } = operator;
  const ref = useMemo(
    () => ({ nodeOperatorId, module }),
    [nodeOperatorId, module],
  );

  const { isCM } = useModule();
  const check = useShowRule();
  const isOperator = check('IS_NODE_OPERATOR');
  const { data: info } = useOperatorInfo({ nodeOperatorId });
  const { data: curve } = useOperatorCurveId(ref);
  const displayType = useDisplayOperatorType(curve);
  const { name, title, metadataName, isLoading } = useOperatorTitle(ref);
  const { data: metadata } = useOperatorMetadata({ nodeOperatorId, module });
  const { data: group } = useOperatorGroup({ nodeOperatorId, module });
  const { data: groupId, isSuccess: isGroupIdSuccess } = useOperatorGroupId({
    nodeOperatorId,
    module,
  });
  const { claimerOn, splittersOn } = useHeaderFlags();

  const description = metadata?.description;
  const hasDescription = isCM && !!description;
  const groupLabel = group && formatGroupLabel(group);

  return (
    <StretchCard dataTestId={{ root: 'dashboardHeaderCard' }}>
      <HeaderGrid
        $tight={isCM}
        $hasDesc={hasDescription}
        $hasSettings={isOperator}
      >
        <AvatarArea>
          <AvatarScale>
            <OperatorAvatar operator={ref} size={72} />
          </AvatarScale>
        </AvatarArea>
        <TitleArea>
          {isLoading ? (
            <Skeleton variant="text" style={TITLE_SKELETON_STYLE} />
          ) : (
            <Typography
              variant="h2"
              as="p"
              dataTestId={{ root: 'operatorName' }}
            >
              {title}
            </Typography>
          )}
          {displayType && (
            <OperatorTypeTag
              type={displayType}
              full
              tooltip={false}
              data-testid="operatorTypeTag"
            />
          )}
        </TitleArea>
        {isOperator && (
          <SettingsArea>
            <TextLink
              href={PATH.SETTINGS}
              icon={<IconArrowRight />}
              onClick={() =>
                trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink)
              }
              dataTestId={{ root: 'dashboardSettingsLink' }}
            >
              Settings
            </TextLink>
          </SettingsArea>
        )}
        <MetaArea>
          {isCM && metadataName && (
            <MetaText testId="descriptorId">{name}</MetaText>
          )}
          {isCM &&
            groupLabel &&
            (isOperator ? (
              <TextLink
                variant="secondary"
                href={PATH.GROUP}
                dataTestId={{ root: 'operatorGroupLink' }}
              >
                {groupLabel}
              </TextLink>
            ) : (
              <MetaText testId="operatorGroupLink">{groupLabel}</MetaText>
            ))}
          {isCM && isGroupIdSuccess && !groupId && (
            <MetaText testId="operatorNoGroup">No group</MetaText>
          )}
          <OperatorAddresses info={info} size="body" />
          {claimerOn && <MetaText testId="claimerFlag">Claimer ON</MetaText>}
          {splittersOn && (
            <MetaText testId="splittersFlag">Splitters ON</MetaText>
          )}
        </MetaArea>
        {hasDescription && (
          <DescriptionArea>
            <MetaText testId="operatorDescription">{description}</MetaText>
          </DescriptionArea>
        )}
      </HeaderGrid>
    </StretchCard>
  );
};

export const OperatorHeaderCard: FC = () => {
  const { nodeOperator } = useNodeOperator();

  return nodeOperator ? <OperatorHeader operator={nodeOperator} /> : null;
};

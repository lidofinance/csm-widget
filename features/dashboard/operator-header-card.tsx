import {
  Card,
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
import { CSSProperties, FC, ReactNode, useMemo } from 'react';
import { useDisplayOperatorType, useShowRule } from 'shared/hooks';
import {
  OperatorAddresses,
  OperatorAvatar,
  formatGroupLabel,
  useOperatorTitle,
} from 'shared/node-operator';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { trackMatomoEvent } from 'utils';
import { useHeaderFlags } from './hooks/use-header-flags';
import s from './operator-header-card.module.css';

const gridAreas = (...rows: (string | false)[]) =>
  rows
    .filter(Boolean)
    .map((row) => `'${row}'`)
    .join(' ');

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
    <Card align="stretch" dataTestId={{ root: 'dashboardHeaderCard' }}>
      <div
        className={s.grid}
        data-tight={isCM || undefined}
        style={
          {
            '--grid-areas': gridAreas(
              'avatar title settings',
              'avatar meta meta',
              hasDescription && 'desc desc desc',
            ),
            '--grid-areas-md': gridAreas(
              'avatar title',
              isOperator && 'settings settings',
              'meta meta',
              hasDescription && 'desc desc',
            ),
          } as CSSProperties
        }
      >
        <div className={s.avatarArea}>
          <div className={s.avatarScale}>
            <OperatorAvatar operator={ref} size={72} />
          </div>
        </div>
        <div className={s.titleArea}>
          {isLoading ? (
            <Skeleton variant="text" width={160} />
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
            <TypeBadgeButton
              curve={curve}
              displayType={displayType}
              full
              data-testid="operatorTypeTag"
            />
          )}
        </div>
        {isOperator && (
          <div className={s.settingsArea}>
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
          </div>
        )}
        <div className={s.metaArea}>
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
        </div>
        {hasDescription && (
          <div className={s.descriptionArea}>
            <MetaText testId="operatorDescription">{description}</MetaText>
          </div>
        )}
      </div>
    </Card>
  );
};

export const OperatorHeaderCard: FC = () => {
  const { nodeOperator } = useNodeOperator();

  return nodeOperator ? <OperatorHeader operator={nodeOperator} /> : null;
};

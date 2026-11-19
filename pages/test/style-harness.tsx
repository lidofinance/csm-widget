import {
  Body,
  Button,
  Caption,
  Card,
  Grid,
  H1,
  H3,
  MessageBox,
  type MessageBoxVariant,
  Stack,
  StatItem,
} from '@lidofinance/lido-app-ui';
import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { DisplayOperatorType, OPERATOR_TYPE_METADATA } from 'consts';
import { ClaimTypeBadges } from 'features/claim-type/shared/claim-type-badges';
import { ClaimTypeCard } from 'features/claim-type/shared/claim-type-card';
import { ShareRowView } from 'features/change-role/splits-form/controls/split-row-view';
import { PenaltyHistoryTable } from 'features/unlock-bond/penalty-history/penalty-history-table';
import { sortFunctions } from 'features/unlock-bond/penalty-history/sort';
import { KeysEmpty } from 'features/view-keys/keys-table/keys-empty';
import { StrikeDotsView } from 'features/view-keys/keys-table/strike-dots-view';
import {
  ADDRESS,
  CREATE_EVENTS,
  CREATE_ROWS,
  LAST_STRIKE_DATE,
  OPTION_ITEMS,
  PARAMETERS_DEFAULT,
  PARAMETERS_ICS,
  PENALTIES,
  PUBKEY,
  SPLIT_ROWS,
  STATUS_COMMENTS,
  STRIKE_DOTS,
} from 'mock/style-harness/fixtures';
import { MockMyOperatorsProvider } from 'mock/my-operators/mock-providers';
import { VARIANTS } from 'mock/my-operators/variants';
import { TableProvider } from 'providers/table-provider';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import {
  AlertComponentType,
  AlertContainer,
  AlertProvider,
  useAlertActions,
} from 'shared/alerts';
import { AlertClaimIcs } from 'shared/alerts/components/alert-claim-ics';
import { AlertExpiredLockedBond } from 'shared/alerts/components/alert-expired-locked-bond';
import {
  AddressInner,
  CompareParametersList,
  MessageBoxLink,
  ParametersList,
  Pubkey,
  StatusComment,
} from 'shared/components';
import { SuccessScreen } from 'shared/form-page';
import { Layout } from 'shared/layout';
import {
  CreateSection,
  CurveBadge,
  OperatorRow,
  OperatorTypeTag,
  TypeBadge,
} from 'shared/node-operator';
import { ModuleMenuIcon } from 'shared/node-operator/module-menu-icon';
import {
  SkeletonBalance,
  TransactionModalContent,
  WhatsNextBlock,
} from 'shared/transaction-modal';
import { Dropzone, OptionList, OptionListItem } from 'shared/ui';
import type {
  OptionListOrientation,
  OptionListVariant,
} from 'shared/ui/option-list';
import { getTestProps } from 'utilsApi';

const ALL_TYPES = Object.keys(OPERATOR_TYPE_METADATA) as DisplayOperatorType[];
const BADGE_TYPES = [
  OPERATOR_TYPE.CSM_DEF,
  OPERATOR_TYPE.CSM2_DEF,
  OPERATOR_TYPE.CSM_ICS,
  OPERATOR_TYPE.CSM_IDVTC,
];
const OPTION_VARIANTS: [OptionListVariant, OptionListOrientation][] = [
  ['list', 'vertical'],
  ['list', 'horizontal'],
  ['cards', 'vertical'],
  ['cards', 'horizontal'],
];
const MESSAGE_VARIANTS: MessageBoxVariant[] = [
  'default',
  'info',
  'warning',
  'error',
  'success',
];
const TX_STATUSES = ['loading', 'success', 'error', 'warning'] as const;
const ALERTS: AlertComponentType[] = [AlertClaimIcs, AlertExpiredLockedBond];
const OPERATORS = VARIANTS['cm-group+csm'].available;
const noop = () => undefined;

const Section: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <Card align="stretch" padding={24} gap={16}>
    <H3>{title}</H3>
    {children}
  </Card>
);

const Row: FC<PropsWithChildren<{ label?: string }>> = ({
  label,
  children,
}) => (
  <Stack gap={8}>
    {label && <Caption color="secondary">{label}</Caption>}
    {children}
  </Stack>
);

const OptionListDemo: FC<{
  variant: OptionListVariant;
  orientation: OptionListOrientation;
}> = ({ variant, orientation }) => {
  const [value, setValue] = useState('first');

  return (
    <OptionList
      value={value}
      onChange={setValue}
      variant={variant}
      orientation={orientation}
      aria-label={`${variant} ${orientation}`}
    >
      {OPTION_ITEMS.map((item) => (
        <OptionListItem key={item.value} {...item} />
      ))}
    </OptionList>
  );
};

const AlertSeeder: FC = () => {
  const { showAlert } = useAlertActions();

  useEffect(() => {
    ALERTS.forEach((alert) => showAlert(alert));
  }, [showAlert]);

  return null;
};

const AlertsDemo: FC<{ wide?: boolean }> = ({ wide }) => (
  <AlertProvider>
    <AlertSeeder />
    <div style={{ position: 'relative', minHeight: 360 }}>
      <AlertContainer wide={wide} />
    </div>
  </AlertProvider>
);

const SuccessScreens: FC = () => (
  <Stack gap={32}>
    <SuccessScreen
      data-testid="successScreenFull"
      title="Node Operator created"
      description="Your Node Operator has been created and keys are uploaded"
      stats={
        <>
          <StatItem label="Node Operator ID" value="#42" />
          <StatItem label="Node Operator type" value="0x02" />
          <StatItem label="Keys uploaded" value="3" />
          <StatItem label="Bond deposited" value="4.2 ETH" />
        </>
      }
      notice={<MessageBox variant="info">Keys will join the queue</MessageBox>}
      next={<Body>Your keys will be deposited once they are validated</Body>}
      actions={
        <>
          <Button>View dashboard</Button>
          <Button variant="outline">Upload more keys</Button>
        </>
      }
    />
    <SuccessScreen
      data-testid="successScreenIcon"
      title="Operator type claimed"
      description="Your Node Operator is now an Identified Community Staker"
      icon={<TypeBadge type={OPERATOR_TYPE.CSM_ICS} size={120} />}
      actions={<Button>Go to dashboard</Button>}
    />
  </Stack>
);

const StrikeDots: FC = () => (
  <Stack direction="row" gap={24} align="center">
    {STRIKE_DOTS.map((state) => (
      <StrikeDotsView key={state.count} {...state} />
    ))}
    <StrikeDotsView {...STRIKE_DOTS[2]} lastStrikeDate={LAST_STRIKE_DATE} />
  </Stack>
);

const TypeTags: FC = () => (
  <Stack gap={16}>
    <Row label="OperatorTypeTag short">
      <Stack direction="row" gap={8} wrap>
        {ALL_TYPES.map((type) => (
          <OperatorTypeTag key={type} type={type} />
        ))}
      </Stack>
    </Row>
    <Row label="OperatorTypeTag full">
      <Stack direction="row" gap={8} wrap>
        {ALL_TYPES.map((type) => (
          <OperatorTypeTag key={type} type={type} full />
        ))}
      </Stack>
    </Row>
    <Row label="OperatorTypeTag tooltip / disabled / clickable">
      <Stack direction="row" gap={8} wrap>
        <OperatorTypeTag type={OPERATOR_TYPE.CSM_ICS} tooltip />
        <OperatorTypeTag type={OPERATOR_TYPE.CSM_IDVTC} disabled />
        <OperatorTypeTag type={OPERATOR_TYPE.CSM_DEF} onClick={noop} />
        <OperatorTypeTag type={OPERATOR_TYPE.CM_PO} onClick={noop} />
      </Stack>
    </Row>
    <Row label="CurveBadge">
      <Stack direction="row" gap={8} wrap align="center">
        {ALL_TYPES.map((type) => (
          <CurveBadge key={type} type={type} />
        ))}
      </Stack>
    </Row>
    <Row label="CurveBadge inline">
      <Body as="div">
        Inline in text{' '}
        {ALL_TYPES.map((type) => (
          <CurveBadge key={type} type={type} inline />
        ))}
      </Body>
    </Row>
    <Row label="TypeBadge 52 / 120 / 240">
      <Stack direction="row" gap={16} wrap align="center">
        {BADGE_TYPES.flatMap((type) =>
          ([52, 120, 240] as const).map((size) => (
            <TypeBadge key={`${type}-${size}`} type={type} size={size} />
          )),
        )}
        <TypeBadge type={OPERATOR_TYPE.CM_PO} />
      </Stack>
    </Row>
  </Stack>
);

const OptionLists: FC = () => (
  <Stack gap={24}>
    {OPTION_VARIANTS.map(([variant, orientation]) => (
      <Row
        key={`${variant}-${orientation}`}
        label={`${variant} ${orientation}`}
      >
        <OptionListDemo variant={variant} orientation={orientation} />
      </Row>
    ))}
  </Stack>
);

const Parameters: FC = () => (
  <Stack gap={32}>
    <Row label="ParametersList CSM">
      <ParametersList
        parameters={PARAMETERS_DEFAULT}
        module={MODULE_NAME.CSM}
      />
    </Row>
    <Row label="ParametersList CM loading">
      <ParametersList module={MODULE_NAME.CM} />
    </Row>
    <Row label="CompareParametersList">
      <CompareParametersList
        module={MODULE_NAME.CSM}
        items={[
          { title: '0x01', parameters: PARAMETERS_DEFAULT },
          { title: 'ICS', parameters: PARAMETERS_ICS },
        ]}
      />
    </Row>
  </Stack>
);

const OperatorRows: FC = () => (
  <MockMyOperatorsProvider variant="cm-group+csm">
    <Stack gap={24}>
      {(['regular', 'compact'] as const).map((size) => (
        <Row key={size} label={`OperatorRow ${size}`}>
          <Stack gap={4}>
            {OPERATORS.map((operator) => (
              <OperatorRow
                key={`${operator.module}-${operator.nodeOperatorId}`}
                operator={operator}
                size={size}
                onSelect={noop}
                data-testid={`harnessRow-${size}-${operator.nodeOperatorId}`}
                data-name-testid={`harnessRowName-${size}-${operator.nodeOperatorId}`}
              />
            ))}
          </Stack>
          <CreateSection
            size={size}
            rows={CREATE_ROWS}
            onCreate={noop}
            events={CREATE_EVENTS}
            testIdPrefix={`harnessCreate-${size}`}
          />
        </Row>
      ))}
      <Row label="ModuleMenuIcon">
        <Stack direction="row" gap={16} align="center">
          <ModuleMenuIcon variant="csm2" size={60} />
          <ModuleMenuIcon variant="csm2" size={40} />
          <ModuleMenuIcon variant="curated2" size={60} />
          <ModuleMenuIcon variant="curated2" size={40} />
        </Stack>
      </Row>
    </Stack>
  </MockMyOperatorsProvider>
);

const TxModalParts: FC = () => (
  <Stack gap={32}>
    {TX_STATUSES.map((status) => (
      <Row key={status} label={`TransactionModalContent ${status}`}>
        <TransactionModalContent
          status={status}
          title={`Status ${status}`}
          description={
            <>
              Description with balance <SkeletonBalance />
              <WhatsNextBlock>
                <li>Wait for the next report</li>
                <li>Claim your rewards</li>
              </WhatsNextBlock>
            </>
          }
          footer={<Button fullWidth>Close</Button>}
          footerHint="A long footer hint that should wrap onto several lines when the modal is narrow enough"
        />
      </Row>
    ))}
    <Row label="TransactionModalContent without footer">
      <TransactionModalContent
        status="success"
        title="Done"
        description="Nothing else to do"
      />
    </Row>
  </Stack>
);

const Dropzones: FC = () => (
  <Stack gap={16}>
    <Row label="idle">
      <Dropzone placeholder="Paste or drop deposit data" />
    </Row>
    <Row label="filled">
      <Dropzone value='[{"pubkey":"0x00"}]' />
    </Row>
    <Row label="error">
      <Dropzone error="Invalid deposit data" value="oops" />
    </Row>
    <Row label="disabled">
      <Dropzone disabled placeholder="Disabled" />
    </Row>
  </Stack>
);

const Addresses: FC = () => (
  <Stack gap={16}>
    <Row label="AddressInner">
      <AddressInner address={ADDRESS} />
      <AddressInner address={ADDRESS} showIcon />
      <AddressInner address={ADDRESS} big showIcon monospace />
      <AddressInner address={ADDRESS} size="md" color="secondary" />
      <AddressInner address={ADDRESS} name="operator.eth" />
    </Row>
    <Row label="Pubkey">
      <Pubkey pubkey={PUBKEY} />
      <Pubkey pubkey={PUBKEY} symbols={12} color="secondary" />
      <Pubkey pubkey={PUBKEY} monospace={false} color="success" />
      <Pubkey pubkey={PUBKEY} symbols={0} />
    </Row>
  </Stack>
);

const StyleHarnessPage: FC = () => (
  <Layout dummy wide title="Style harness">
    <Stack gap={24}>
      <H1>Style harness</H1>
      <Section title="SuccessScreen">
        <SuccessScreens />
      </Section>
      <Section title="KeysEmpty">
        <KeysEmpty />
      </Section>
      <Section title="StrikeDotsView">
        <StrikeDots />
      </Section>
      <Section title="PenaltyHistoryTable">
        <TableProvider
          data={PENALTIES}
          sort={sortFunctions}
          defaultSort={{ column: 'timestamp', direction: 'desc' }}
        >
          <PenaltyHistoryTable />
        </TableProvider>
      </Section>
      <Section title="ShareRowView">
        <Stack gap={12}>
          {SPLIT_ROWS.map((row) => (
            <ShareRowView key={row.label} {...row} />
          ))}
        </Stack>
      </Section>
      <Section title="AlertContainer narrow">
        <AlertsDemo />
      </Section>
      <Section title="AlertContainer wide">
        <AlertsDemo wide />
      </Section>
      <Section title="Badges and tags">
        <TypeTags />
      </Section>
      <Section title="OptionList">
        <OptionLists />
      </Section>
      <Section title="ParametersList">
        <Parameters />
      </Section>
      <Section title="Operator rows">
        <OperatorRows />
      </Section>
      <Section title="Transaction modal parts">
        <TxModalParts />
      </Section>
      <Section title="StatusComment">
        <Stack gap={8}>
          {STATUS_COMMENTS.map(({ title, statuses }) => (
            <Row key={title} label={title}>
              <StatusComment statuses={statuses} />
            </Row>
          ))}
        </Stack>
      </Section>
      <Section title="MessageBoxLink">
        <Stack gap={12}>
          {MESSAGE_VARIANTS.map((variant) => (
            <MessageBoxLink key={variant} href="/" variant={variant}>
              {variant}
            </MessageBoxLink>
          ))}
        </Stack>
      </Section>
      <Section title="Dropzone">
        <Dropzones />
      </Section>
      <Section title="Address and Pubkey">
        <Addresses />
      </Section>
      <Section title="ClaimTypeCard">
        <Grid minItemWidth={320} gap={24} align="start">
          <ClaimTypeCard
            title="Identified Community Staker"
            description="Apply for the ICS type"
            badges={
              <ClaimTypeBadges
                from={OPERATOR_TYPE.CSM_DEF}
                to={OPERATOR_TYPE.CSM_ICS}
              />
            }
            data-testid="harnessClaimCardArrow"
          >
            <Button fullWidth>Claim</Button>
          </ClaimTypeCard>
          <ClaimTypeCard
            title="Identified DVT Cluster"
            description="Add the IDVTC type"
            badges={
              <ClaimTypeBadges
                from={OPERATOR_TYPE.CSM_ICS}
                to={OPERATOR_TYPE.CSM_IDVTC}
                join="plus"
              />
            }
          />
          <ClaimTypeCard
            title="No badge"
            description="Only a target badge"
            badges={<ClaimTypeBadges to={OPERATOR_TYPE.CSM_IDVTC} />}
          />
        </Grid>
      </Section>
    </Stack>
  </Layout>
);

export default StyleHarnessPage;

export const getStaticProps = getTestProps;

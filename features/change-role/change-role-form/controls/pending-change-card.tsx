import { IconWarning, Tag, Typography } from '@lidofinance/lido-app-ui';
import { WIDGET_TITLE } from 'consts';
import { FC } from 'react';
import { SubmitButton } from 'shared/form-page';
import { useModuleMeta } from 'shared/hooks';
import { isAddressEqual } from 'viem';
import { RoleAddress } from '../../shared/role-address';
import { RoleCard } from '../../shared/role-card';
import { StepsListStyle } from '../../shared/styles';
import { getPendingChangeIntent } from '../change-role-state';
import { useChangeRoleFlow, useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/use-role';

const WARNING_ICON_STYLE = { color: 'var(--lido-app-ui-color-icons-warning)' };

export const PendingChangeCard: FC = () => {
  const roleTitle = useRole();
  const meta = useModuleMeta();
  const flow = useChangeRoleFlow();
  const { proposedAddress, address, invite } = useChangeRoleFormData(true);

  if (!proposedAddress) return null;

  const intent = getPendingChangeIntent({
    action: flow.action,
    hasInvite: !!invite,
  });

  return (
    <RoleCard
      data-testid="proposedAddress"
      icon={<IconWarning width={20} height={20} style={WARNING_ICON_STYLE} />}
      title="Pending change"
      action={
        intent && (
          <SubmitButton
            intent={intent}
            variant="outline"
            size="small"
            fullWidth={false}
            ignoreErrors
          >
            {intent === 'revoke' ? 'Cancel' : 'Accept'}
          </SubmitButton>
        )
      }
    >
      <Typography variant="body" as="p">
        A new {roleTitle} Address has been proposed and is waiting for
        confirmation:
      </Typography>
      <RoleAddress
        address={proposedAddress}
        data-testid="pendingAddress"
        tags={
          isAddressEqual(proposedAddress, address) && (
            <Tag variant="neutral">You</Tag>
          )
        }
      />
      <Typography
        variant="body"
        as="div"
        dataTestId={{ root: 'pendingActionRequired' }}
      >
        <Typography variant="body" weight="semibold" as="p">
          Action required
        </Typography>
        <StepsListStyle>
          <li>
            Connect to {meta?.shortTitle ?? WIDGET_TITLE} UI with the proposed
            address
          </li>
          <li>Go to Settings tab → Inbox requests to confirm the change</li>
        </StepsListStyle>
      </Typography>
    </RoleCard>
  );
};

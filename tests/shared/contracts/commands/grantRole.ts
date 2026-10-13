import { parseAbi, parseEther } from 'viem';
import type { Addresses, Hex } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

type Contract = Exclude<keyof Addresses, 'gates'>;

// Role → contract that holds it and what it unlocks there. Gate roles are left
// out: the gate tree is set with setGateAddrs.
export const ROLES = {
  DEFAULT_ADMIN_ROLE: ['module', 'grant and revoke any module role'],
  CREATE_NODE_OPERATOR_ROLE: ['module', 'createNodeOperator (gates use it)'],
  OPERATOR_ADDRESSES_ADMIN_ROLE: [
    'module',
    'changeNodeOperatorAddresses: force-set manager/reward address',
  ],
  PAUSE_ROLE: ['module', 'pauseFor: pause the module'],
  RESUME_ROLE: ['module', 'resume a paused module'],
  RECOVERER_ROLE: ['module', 'recover ETH/tokens stuck on the module'],
  REPORT_GENERAL_DELAYED_PENALTY_ROLE: [
    'module',
    'report/cancel delayed penalty, opens /delayed-penalty in the widget',
  ],
  SETTLE_GENERAL_DELAYED_PENALTY_ROLE: [
    'module',
    'settleGeneralDelayedPenalty: burn the locked bond',
  ],
  REPORT_REGULAR_WITHDRAWN_VALIDATORS_ROLE: [
    'module',
    'reportRegularWithdrawnValidators',
  ],
  REPORT_SLASHED_WITHDRAWN_VALIDATORS_ROLE: [
    'module',
    'reportSlashedWithdrawnValidators',
  ],
  STAKING_ROUTER_ROLE: [
    'module',
    'StakingRouter callbacks: deposits, exited counts, target limits',
  ],
  VERIFIER_ROLE: ['module', 'reportValidatorSlashing, reportValidatorBalance'],
  MANAGE_BOND_CURVES_ROLE: ['accounting', 'addBondCurve, updateBondCurve'],
  SET_BOND_CURVE_ROLE: ['accounting', 'setBondCurve: change operator type'],
  MANAGE_OPERATOR_GROUPS_ROLE: [
    'metaRegistry',
    'createOrUpdateOperatorGroup (CM)',
  ],
  SET_BOND_CURVE_WEIGHT_ROLE: ['metaRegistry', 'setBondCurveWeight (CM)'],
  SET_OPERATOR_INFO_ROLE: [
    'metaRegistry',
    'setOperatorMetadataAsAdmin: name/description (CM)',
  ],
} as const satisfies Record<string, readonly [Contract, string]>;

export type RoleName = keyof typeof ROLES;

const accessControlAbi = parseAbi([
  'function getRoleAdmin(bytes32 role) view returns (bytes32)',
  'function getRoleMember(bytes32 role, uint256 index) view returns (address)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function grantRole(bytes32 role, address account)',
]);

export const grantRole = async function (
  this: ForkActionsService,
  role: RoleName,
  account: Hex,
): Promise<void> {
  const [contract] = ROLES[role] ?? [];
  if (!contract) {
    throw new Error(
      `Unknown role "${role}", available: ${Object.keys(ROLES).join(', ')}`,
    );
  }
  const address = this.addresses[contract];
  if (!address) {
    throw new Error(
      `No ${contract} for module "${this.module}" on ${this.chain}`,
    );
  }

  await this.step(
    `[Contract] Grant ${role} on ${contract} to ${account}`,
    async () => {
      const roleHash = await this.client.readContract({
        address,
        abi: parseAbi([`function ${role}() view returns (bytes32)`]),
        functionName: role,
      });

      const hasRole = await this.client.readContract({
        address,
        abi: accessControlAbi,
        functionName: 'hasRole',
        args: [roleHash, account],
      });
      if (hasRole) {
        console.info(`${account} already has ${role}`);
        return;
      }

      const adminRole = await this.client.readContract({
        address,
        abi: accessControlAbi,
        functionName: 'getRoleAdmin',
        args: [roleHash],
      });
      const admin = await this.client.readContract({
        address,
        abi: accessControlAbi,
        functionName: 'getRoleMember',
        args: [adminRole, 0n],
      });
      await this.fund(admin, parseEther('1'));

      await this.sendAs(admin, () =>
        this.client.writeContract({
          address,
          abi: accessControlAbi,
          functionName: 'grantRole',
          args: [roleHash, account],
          account: admin,
          chain: null,
        }),
      );
    },
  );
};

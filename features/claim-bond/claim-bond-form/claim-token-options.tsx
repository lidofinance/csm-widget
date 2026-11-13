import {
  isTokenIcon,
  TokenIcon,
  TokenSelectorOption,
} from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { INSTANT_WAITING_TIME } from 'consts/text';
import { getTokenOptionTestId } from 'shared/hook-form/fields/bond-token-options';
import { formatBalance } from 'utils/format-balance';
import { getTokenDisplayName } from 'utils/get-token-display-name';

export const CLAIM_TOKEN_LABEL_TEST_ID = 'tokenOptionLabel';
export const CLAIM_TOKEN_WAITING_TIME_TEST_ID = 'waitingTime';

export const ETH_NFT_NOTE =
  'You will need to manually claim the withdrawal NFT after the time period';

export type ClaimTokenOptionsInput = {
  maxValues: Record<TOKENS, bigint>;
  ethWaitingTime?: string;
  /** Smart-contract Rewards Address without the risk checkbox: only wstETH. */
  contractLocked: boolean;
};

const TOKEN_ORDER = [TOKENS.eth, TOKENS.steth, TOKENS.wsteth] as const;

const getWaitingTime = (token: TOKENS, ethWaitingTime?: string) => {
  if (token !== TOKENS.eth) return INSTANT_WAITING_TIME;
  return ethWaitingTime
    ? `${ethWaitingTime} via withdrawal NFT`
    : 'via withdrawal NFT';
};

export const getClaimTokenOptions = ({
  maxValues,
  ethWaitingTime,
  contractLocked,
}: ClaimTokenOptionsInput): TokenSelectorOption[] =>
  TOKEN_ORDER.map((token) => {
    const max = maxValues[token];

    return {
      value: token,
      icon: isTokenIcon(token) ? <TokenIcon token={token} /> : undefined,
      label: `${formatBalance(max).trimmed} ${getTokenDisplayName(token)}`,
      secondaryLabel: getWaitingTime(token, ethWaitingTime),
      description: token === TOKENS.eth ? ETH_NFT_NOTE : undefined,
      disabled: max === 0n || (contractLocked && token !== TOKENS.wsteth),
      dataTestId: {
        root: getTokenOptionTestId(token),
        label: CLAIM_TOKEN_LABEL_TEST_ID,
        secondaryLabel: CLAIM_TOKEN_WAITING_TIME_TEST_ID,
      },
    };
  });

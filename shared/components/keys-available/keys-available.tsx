import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { Plural, Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { StyledText } from './style';

export const KeysAvailable: FC<{
  count?: number;
  amount?: BigNumber;
  token: TOKENS;
}> = ({ count = 0, amount, token }) => (
  <Stack direction="column" gap="xs">
    <p>Keys available to upload</p>
    <p>
      <StyledText>
        {count} <Plural variants={['key', 'keys']} value={count} />
      </StyledText>
      <span>
        ≈ <FormatToken amount={amount} token={token} maxDecimalDigits={2} />
      </span>
    </p>
  </Stack>
);

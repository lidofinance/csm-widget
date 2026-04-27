import { FeeSplit, PERCENT_BASIS, TOKENS } from '@lidofinance/lido-csm-sdk';
import { AccordionTransparent, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Address, IconTooltip, Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';

type Props = {
  feeSplits: FeeSplit[];
  amount: bigint;
};

const splitAmount = (amount: bigint, share: bigint) =>
  (amount * share) / PERCENT_BASIS;

export const ClaimBondFormInfoSplitters: FC<Props> = ({
  feeSplits,
  amount,
}) => {
  const total = feeSplits.reduce(
    (sum, s) => sum + splitAmount(amount, s.share),
    0n,
  );

  return (
    <AccordionStyle
      withoutBorder
      summary={
        <Stack gap="md" center spaceBetween>
          <div>
            Splitter addresses ({feeSplits.length}) will receive
            <IconTooltip
              placement="bottomLeft"
              type="question"
              tooltip="When you claim rewards, they will be distributed to the splitter recipients in stETH according to the configured shares."
            />
          </div>
          <Text size="xxs">
            <FormatToken amount={total} token={TOKENS.steth} />
          </Text>
        </Stack>
      }
    >
      <Stack direction="column" gap="sm">
        {feeSplits.map((split) => (
          <Stack spaceBetween key={split.recipient}>
            <Address
              address={split.recipient}
              size="xxs"
              weight={700}
              color="secondary"
              noStyle
            />
            <FormatToken
              amount={splitAmount(amount, split.share)}
              token={TOKENS.steth}
            />
          </Stack>
        ))}
      </Stack>
    </AccordionStyle>
  );
};

const AccordionStyle = styled(AccordionTransparent)`
  padding: 0;

  & > div:first-child > div:first-child {
    color: var(--lido-color-textSecondary);
    font-weight: 400;
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    line-height: 1.6em;

    > div {
      margin: 0;
    }
  }

  & > div:first-child span:has(> svg) {
    opacity: 1;
    vertical-align: bottom;
    margin-block: -3px;
    display: inline-block;
  }

  & > div + div > div {
    padding-top: ${({ theme }) => theme.spaceMap.sm}px;
  }
`;

import { CurveParameters, TOKENS } from '@lidofinance/lido-csm-sdk';
import { ReactNode } from 'react';
import { FormatToken } from 'shared/formatters';
import { plural } from 'utils';
import {
  formatPercentKeyIntervals,
  formatEthKeyIntervals,
  formatQueues,
  formatKeysLimit,
  formatSecondsDuration,
} from './format';

export const PARAMETERS: {
  title: string;
  help: string;
  render: (parameters?: CurveParameters) => ReactNode[];
}[] = [
  {
    title: 'Node Operator reward',
    help: 'A share of the Consensus and Execution layers rewards',
    render: (parameters) =>
      formatPercentKeyIntervals(parameters?.rewardsConfig),
  },
  {
    title: 'Bond',
    help: 'A security collateral that Node Operators must submit before uploading validator keys into CSM',
    render: (parameters) => formatEthKeyIntervals(parameters?.bondConfig),
  },
  {
    title: 'Priority queue',
    help: 'A queue that stays ahead of the general queue',
    render: (parameters) => formatQueues(parameters?.queueConfig),
  },
  {
    title: 'Removal fee',
    help: "An amount deducted from the Node Operator's bond per each deleted key to cover the maximal possible operational costs associated with the queue processing",
    render: (parameters) => [
      <>
        <FormatToken amount={parameters?.keyRemovalFee} token={TOKENS.eth} />{' '}
        for all keys
      </>,
    ],
  },
  {
    title: 'Performance leeway',
    help: 'A value that is deducted from the network average performance to determine the threshold for the key',
    render: (parameters) =>
      formatPercentKeyIntervals(parameters?.performanceLeewayConfig),
  },
  {
    title: 'EL stealing penalty',
    help: 'A fine charged in case of EL rewards stealing event settled',
    render: (parameters) => [
      <>
        <FormatToken
          amount={parameters?.elStealingPenalty}
          token={TOKENS.eth}
        />
      </>,
    ],
  },
  {
    title: 'Strikes parameters',
    help: 'A number of strikes requires for a key to be exited and a time period of strike validity ',
    render: (parameters) => [
      <>
        {plural({
          value: Number(parameters?.strikesConfig?.threshold ?? 0n),
          variants: ['strike', 'strikes'],
          showValue: true,
        })}{' '}
        till key exit
      </>,
      <>
        strike lifetime:{' '}
        {plural({
          value: Number(parameters?.strikesConfig?.lifetime ?? 0n),
          variants: ['month', 'months'],
          showValue: true,
        })}
      </>,
    ],
  },
  {
    title: 'Bad performance penalty',
    help: 'A penalty for the validator that was ejected due to strikes accumulated for bad performance',
    render: (parameters) => [
      <>
        <FormatToken
          amount={parameters?.badPerformancePenalty}
          token={TOKENS.eth}
        />
      </>,
    ],
  },
  {
    title: 'Keys limit',
    help: 'A maximum number of keys a node operator can have during its lifetime',
    render: (parameters) => formatKeysLimit(parameters?.keysLimit),
  },
  {
    title: 'Performance coefficients',
    help: 'Parameter weights accounted for in the calculation of the aggregated performance metric',
    render: (parameters) => [
      <>
        {parameters?.performanceCoefficients?.attestationsWeight?.toString()}{' '}
        for attestations
      </>,
      <>
        {parameters?.performanceCoefficients?.blocksWeight?.toString()} for
        block proposals
      </>,
      <>
        {parameters?.performanceCoefficients?.syncWeight?.toString()} for sync
        committee
      </>,
    ],
  },
  {
    title: 'Allowed exit delay',
    help: 'A timeframe for a key to be exited voluntary before it gets ejected from the protocol using triggerable withdrawals',
    render: (parameters) => [
      <>{formatSecondsDuration(parameters?.allowedExitDelay ?? 0n)}</>,
    ],
  },
  {
    title: 'Exit delay penalty',
    help: 'A fine charged in case of the key exit delay',
    render: (parameters) => [
      <>
        <FormatToken amount={parameters?.exitDelayPenalty} token={TOKENS.eth} />
      </>,
    ],
  },
];

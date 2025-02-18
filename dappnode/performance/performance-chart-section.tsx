import { FC, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  LegendWrapper,
  LegendItem,
  getColor,
  ChartControls,
  ChartControlsWrapper,
  SelectedRangeWrapper,
  ChartWrapper,
  ChartSectionWrapper,
  TooltipIcon,
} from './components/styles';
import { Range } from './types';
import { WhenLoaded } from 'shared/components';
import { Link, Tooltip, Text } from '@lidofinance/lido-ui';

interface PerformanceChartProps {
  isLoading: boolean;
  thresholdsByEpoch: any[];
  range: Range;
  chainId: number;
}

export const PerformanceChartSection: FC<PerformanceChartProps> = ({
  isLoading,
  thresholdsByEpoch,
  range,
  chainId,
}) => {
  const [reportsRange, setReportsRange] = useState<number>(2); // Default value for 'week'
  const [visibleValidators, setVisibleValidators] = useState<string[]>([]);

  // Since the minimum granularity in holesky is 'week' and in mainnet 'month', do not display the slider controls. Also, if there are less than 3 reports, do not display the slider controls
  const displayChartControls =
    thresholdsByEpoch.length > 2
      ? chainId === 1 && range === 'month'
        ? false
        : chainId !== 1 && range === 'week'
          ? false
          : true
      : false;

  // Sets the report range based on the network (since reports are distrubuted differently) and also checks if db has less reports than available in range time
  useEffect(() => {
    if (range === 'month') {
      setReportsRange(
        chainId === 1
          ? 2
          : thresholdsByEpoch.length < 4
            ? thresholdsByEpoch.length
            : 4,
      );
    } else if (range === 'week') {
      setReportsRange(2);
    } else if (range === 'year') {
      setReportsRange(
        chainId === 1
          ? thresholdsByEpoch.length < 12
            ? thresholdsByEpoch.length
            : 12
          : thresholdsByEpoch.length < 52
            ? thresholdsByEpoch.length
            : 52,
      );
    } else {
      setReportsRange(thresholdsByEpoch.length);
    }
  }, [chainId, range, thresholdsByEpoch]);

  // Initialize `visibleValidators` to include all validator keys by default
  useEffect(() => {
    const allValidators = Array.from(
      thresholdsByEpoch.reduce<Set<string>>((keys, entry) => {
        Object.keys(entry).forEach((key) => {
          if (key !== 'name' && key !== 'lidoThreshold') {
            keys.add(key);
          }
        });
        return keys;
      }, new Set()),
    );
    setVisibleValidators(allValidators);
  }, [thresholdsByEpoch]);

  const visibleData = thresholdsByEpoch.slice(-reportsRange);

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = Math.max(2, parseInt(event.target.value, 10)); // Ensure the value is not below 2 since at least 2 reports needed to display the chart
    setReportsRange(newRange);
  };

  const handleValidatorToggle = (validatorKey: string) => () => {
    if (visibleValidators.includes(validatorKey)) {
      setVisibleValidators((prev) =>
        prev.filter((visibleValidator) => visibleValidator !== validatorKey),
      );
    } else {
      setVisibleValidators((prev) => [...prev, validatorKey]);
    }
  };

  return (
    <>
      <Text as="h2" size="md" weight={800}>
        Node Operator Efficiency vs Lido Average Efficiency
      </Text>
      <WhenLoaded
        loading={isLoading}
        empty={
          thresholdsByEpoch.length === 0 &&
          'No active keys associated to your Node Operator for this range'
        }
      >
        <ChartSectionWrapper>
          <ChartWrapper>
            <ResponsiveContainer>
              <div>
                <LineChart width={750} height={400} data={visibleData}>
                  {/* Always render the line for lidoThreshold */}
                  <Line
                    type="monotone"
                    dataKey="lidoThreshold"
                    stroke="#00a3ff"
                    name="Lido Threshold"
                    strokeWidth={3}
                    dot={{ r: 2, fill: '#00a3ff' }}
                  />

                  {/* Render a line for each visibleValidator */}
                  {thresholdsByEpoch.length > 0 &&
                    Array.from(
                      thresholdsByEpoch.reduce<Set<string>>((keys, entry) => {
                        Object.keys(entry).forEach((key) => {
                          if (key !== 'name' && key !== 'lidoThreshold') {
                            keys.add(key);
                          }
                        });
                        return keys;
                      }, new Set()),
                    ).map(
                      (validatorKey, index) =>
                        visibleValidators.includes(validatorKey) && (
                          <Line
                            key={validatorKey}
                            dataKey={validatorKey}
                            stroke={getColor(index)}
                            name={validatorKey}
                          />
                        ),
                    )}

                  <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    label={{
                      value: `Epochs`,
                      style: { textAnchor: 'middle' },
                      position: 'bottom',
                      offset: -8,
                    }}
                  />
                  <YAxis
                    label={{
                      value: `Efficency (%)`,
                      style: { textAnchor: 'middle' },
                      angle: -90,
                      position: 'left',
                      offset: -5,
                    }}
                  />
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: 'var(--lido-color-foreground)',
                    }}
                    wrapperStyle={{ zIndex: 1 }}
                  />
                </LineChart>
              </div>
            </ResponsiveContainer>

            <LegendWrapper>
              <LegendItem color="#00a3ff">Lido Threshold</LegendItem>
              {thresholdsByEpoch.length > 0 &&
                Array.from(
                  thresholdsByEpoch.reduce<Set<string>>((keys, entry) => {
                    Object.keys(entry).forEach((key) => {
                      if (key !== 'name' && key !== 'lidoThreshold') {
                        keys.add(key);
                      }
                    });
                    return keys;
                  }, new Set()),
                ).map((validatorKey, index) => (
                  <LegendItem
                    key={validatorKey}
                    color={
                      visibleValidators.includes(validatorKey)
                        ? getColor(index)
                        : 'var(--lido-color-textSecondary)'
                    }
                    onClick={handleValidatorToggle(validatorKey)}
                  >
                    {validatorKey}
                  </LegendItem>
                ))}
            </LegendWrapper>
          </ChartWrapper>

          {displayChartControls && (
            <ChartControlsWrapper>
              <SelectedRangeWrapper>
                <Tooltip
                  placement="top"
                  title={
                    <>
                      A frame is the period of time between the Lido CSM
                      reports. In each report, a new Lido threshold is
                      propagated. For more information, check out{' '}
                      <Link href="https://operatorportal.lido.fi/modules/community-staking-module#block-c6dc8d00f13243fcb17de3fa07ecc52c">
                        Lido&apos;s Documentation
                      </Link>
                      .
                    </>
                  }
                >
                  <p>
                    Frames to Display<TooltipIcon>?</TooltipIcon>:{' '}
                  </p>
                </Tooltip>

                <div>{reportsRange}</div>
              </SelectedRangeWrapper>

              <ChartControls className="controls">
                <p>2</p>
                <input
                  type="range"
                  min="2"
                  max={thresholdsByEpoch.length}
                  value={reportsRange}
                  onChange={handleRangeChange}
                />
                <p>{thresholdsByEpoch.length}</p>
              </ChartControls>
              <br />
            </ChartControlsWrapper>
          )}
        </ChartSectionWrapper>
      </WhenLoaded>
    </>
  );
};

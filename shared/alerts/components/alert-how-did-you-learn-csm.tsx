import { Box, Button, Option, Text } from '@lidofinance/lido-ui';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Stack } from 'shared/components';
import { trackMatomoEvent, trackMatomoHowLearnCsm } from 'utils';
import { Alert } from './alert';
import { StyledInput, StyledSelect, SuccessIcon } from './styles';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

type Option = {
  title: string;
  value: string;
  raw?: string;
};

type OptionReason = Option & {
  options?: Option[];
  subtitle?: string;
};

const OPTIONS: OptionReason[] = [
  {
    title: 'Lido Community Lifeguard',
    value: 'lifeguard',
    subtitle: 'Who was it?',
    options: [
      { title: 'Sam (Stakesaurus)', value: 'stakesaurus' },
      { title: 'Isaac (enti)', value: 'enti' },
      { title: 'StakeCat', value: 'stakecat' },
    ],
  },
  {
    title: 'Crypto Community',
    value: 'community',
    subtitle: 'Specify the community',
    options: [
      { title: 'Lido', value: 'lido' },
      { title: 'EthStaker', value: 'ethstaker' },
      { title: 'SEEDLatam', value: 'seedlatam' },
      { title: 'Bitskwela', value: 'bitskwela' },
      { title: 'ETH Mexico', value: 'eth_mexico' },
      { title: 'Next Finance Tech', value: 'next_finance_tech' },
      { title: 'SSV', value: 'ssv' },
      { title: 'Obol', value: 'obol' },
      { title: 'Other', value: 'other', raw: 'What was the community?' },
    ],
  },
  {
    title: 'Live Event',
    value: 'live',
    subtitle: 'Specify the event',
    options: [
      { title: 'EthCC', value: 'ethcc' },
      { title: 'KBW', value: 'kbw' },
      { title: 'Token 2049', value: 'token_2049' },
      { title: 'ETH Sofia', value: 'eth_sofia' },
      { title: 'Merge Madrid', value: 'merge_madrid' },
      {
        title: 'Lido gathering (Singapore)',
        value: 'lido_gathering_singapore',
      },
      { title: 'Stakers Guild (Brussels)', value: 'stakers_guild_brussels' },
      { title: 'Other', value: 'other', raw: 'What was the event?' },
    ],
  },
  {
    title: 'Online Event',
    value: 'online',
    subtitle: 'What was the event?',
    options: [
      { title: 'Lido NOCCs', value: 'noccs' },
      { title: 'Lido CS Roundtables', value: 'cs_rountables' },
      { title: 'EthStaker Community Call - CSM', value: 'ethstaker_cc_csm' },
      { title: 'Other', value: 'other', raw: 'What was the event?' },
    ],
  },
  { title: 'Friend or Colleague', value: 'friend_or_colleague' },
  { title: 'Other', value: 'other', raw: 'Please, specify the source' },
];

type FormInput = {
  reason1?: string;
  reason2?: string;
  raw?: string;
};

export const AlertHowDidYouLearCsm: FC<{
  onClose: () => void;
  onAnswer: () => void;
}> = ({ onClose, onAnswer }) => {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, watch, control, resetField } =
    useForm<FormInput>();

  const handleClose = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.howLearnCsmClose);
    onClose();
  }, [onClose]);

  const onSubmit = useCallback(
    (data: FormInput) => {
      trackMatomoHowLearnCsm(data.reason1, data.reason2, data.raw);
      setSubmitted(true);
      onAnswer();
    },
    [onAnswer],
  );

  const [reason1, reason2] = watch(['reason1', 'reason2']);

  useEffect(() => {
    resetField('reason2');
  }, [resetField, reason1]);

  useEffect(() => {
    resetField('raw');
  }, [resetField, reason1, reason2]);

  const selected1 = useMemo(
    () => OPTIONS.find((item) => item.value === reason1),
    [reason1],
  );
  const selected2 = useMemo(
    () => selected1?.options?.find((item) => item.value === reason2),
    [reason2, selected1?.options],
  );

  const rawInput = useMemo(() => {
    return selected1?.raw || selected2?.raw;
  }, [selected1?.raw, selected2?.raw]);

  if (submitted) {
    return (
      <Alert onClose={handleClose}>
        <Box paddingTop={24} paddingBottom={24}>
          <Stack direction="column" center>
            <SuccessIcon />
            <Text size="xs" weight="bold">
              Thank you for the feedback!
            </Text>
          </Stack>
        </Box>
      </Alert>
    );
  }

  return (
    <Alert title="How Did You Learn About CSM?" onClose={handleClose}>
      <Stack direction="column" gap="lg">
        <p>Your feedback helps CSM focus on targeted communication channels</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" gap="lg">
            <Controller
              control={control}
              name="reason1"
              rules={{ required: true }}
              render={({ field }) => (
                <StyledSelect
                  fullwidth
                  variant="small"
                  placeholder="What led you to CSM?"
                  {...field}
                >
                  {OPTIONS.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.title}
                    </Option>
                  ))}
                </StyledSelect>
              )}
            />

            {selected1?.options && (
              <Controller
                control={control}
                name="reason2"
                rules={{ required: true }}
                render={({ field }) => (
                  <StyledSelect
                    fullwidth
                    variant="small"
                    placeholder={selected1.subtitle}
                    {...field}
                  >
                    {selected1?.options?.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.title}
                      </Option>
                    ))}
                  </StyledSelect>
                )}
              />
            )}

            {rawInput && (
              <StyledInput
                {...register('raw', { required: true })}
                placeholder={rawInput}
                variant="small"
              />
            )}

            <Button size="xs" color="secondary" fullwidth type="submit">
              Send
            </Button>
          </Stack>
        </form>
      </Stack>
    </Alert>
  );
};

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
  raw?: string;
};

type OptionReason = Option & {
  options?: Option[];
  subtitle?: string;
};

const OPTIONS: OptionReason[] = [
  {
    title: 'Lido Community Lifeguard',
    subtitle: 'Who was it?',
    options: [
      { title: 'Sam (Stakesaurus)' },
      { title: 'Isaac (enti)' },
      { title: 'StakeCat' },
    ],
  },
  {
    title: 'Crypto Community',
    subtitle: 'Specify the community',
    options: [
      { title: 'Lido' },
      { title: 'EthStaker' },
      { title: 'SEEDLatam' },
      { title: 'Bitskwela' },
      { title: 'ETH Mexico' },
      { title: 'Next Finance Tech' },
      { title: 'SSV' },
      { title: 'Obol' },
      { title: 'Other', raw: 'What was the community?' },
    ],
  },
  {
    title: 'Live Event',
    subtitle: 'Specify the event',
    options: [
      { title: 'EthCC' },
      { title: 'KBW' },
      { title: 'Token 2049' },
      { title: 'ETH Sofia' },
      { title: 'Merge Madrid' },
      {
        title: 'Lido gathering (Singapore)',
      },
      { title: 'Stakers Guild (Brussels)' },
      { title: 'Other', raw: 'What was the event?' },
    ],
  },
  {
    title: 'Online Event',
    subtitle: 'What was the event?',
    options: [
      { title: 'Lido NOCCs' },
      { title: 'Lido CS Roundtables' },
      { title: 'EthStaker Community Call - CSM' },
      { title: 'Other', raw: 'What was the event?' },
    ],
  },
  { title: 'Friend or Colleague' },
  { title: 'Other', raw: 'Please, specify the source' },
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
      const answer = [data.reason1, data.reason2, data.raw]
        .filter(Boolean)
        .join(' > ');
      trackMatomoHowLearnCsm(answer);
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
    () => OPTIONS.find((item) => item.title === reason1),
    [reason1],
  );
  const selected2 = useMemo(
    () => selected1?.options?.find((item) => item.title === reason2),
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
                    <Option key={item.title} value={item.title}>
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
                      <Option key={item.title} value={item.title}>
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

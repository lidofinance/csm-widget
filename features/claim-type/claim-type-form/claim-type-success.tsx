import { Text } from '@lidofinance/lido-ui';
import { FC, useCallback, useRef } from 'react';
import Confetti from 'react-canvas-confetti/dist/presets/realistic';
import {
  TConductorInstance,
  TOnInitPresetFn,
} from 'react-canvas-confetti/dist/types';
import { Stack } from 'shared/components';
import {
  BadgeMain,
  BadgeText,
  BadgeWrapper,
  canvasStyles,
  StyledButton,
  StyledContainer,
} from './styles';

export const ClaimTypeSuccess: FC = () => {
  const controller = useRef<TConductorInstance>();

  const onInitHandler: TOnInitPresetFn = ({ conductor }) => {
    controller.current = conductor;
  };

  const fire = useCallback(() => {
    controller.current?.shoot();
  }, []);

  return (
    <StyledContainer>
      <Confetti
        onInit={onInitHandler}
        style={canvasStyles}
        autorun={{ speed: 1, duration: 1 }}
        decorateOptions={(options) => ({
          ...options,
          origin: {
            x: 0.3 + Math.random() * 0.4,
            y: 0.4 + Math.random() * 0.3,
          },
        })}
      />
      <BadgeWrapper>
        <BadgeMain>
          <BadgeText>ICS</BadgeText>
        </BadgeMain>
      </BadgeWrapper>
      <Stack direction="column">
        <Text size="xl" weight={700}>
          Congratulations!
        </Text>
        <Text size="xs">
          You have claimed the Identified Community Staker operator type
          <br />
          You can see the new parameters for your Node Operator by clicking the
          ICS badge on the top of the screen
        </Text>
      </Stack>
      <StyledButton fullwidth onClick={fire}>
        Amazing!
      </StyledButton>
    </StyledContainer>
  );
};

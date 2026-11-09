import { Button } from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC, ReactNode, useCallback, useRef } from 'react';
import Confetti from 'react-canvas-confetti/dist/presets/realistic';
import {
  TConductorInstance,
  TOnInitPresetFn,
} from 'react-canvas-confetti/dist/types';
import { SuccessScreen } from 'shared/form-page';
import { getOperatorTypeBadge } from './claim-type-badges';
import { confettiCanvasStyles, SuccessBadgeStyle } from './styles';

export type ClaimTypeSuccessProps = {
  type: OPERATOR_TYPE;
  description: ReactNode;
  notice?: ReactNode;
};

export const ClaimTypeSuccess: FC<ClaimTypeSuccessProps> = ({
  type,
  description,
  notice,
}) => {
  const controller = useRef<TConductorInstance>();
  const badge = getOperatorTypeBadge(type);

  const onInitHandler: TOnInitPresetFn = ({ conductor }) => {
    controller.current = conductor;
  };

  const fire = useCallback(() => {
    controller.current?.shoot();
  }, []);

  return (
    <>
      <Confetti
        onInit={onInitHandler}
        style={confettiCanvasStyles}
        autorun={{ speed: 1, duration: 1 }}
        decorateOptions={(options) => ({
          ...options,
          origin: {
            x: 0.3 + Math.random() * 0.4,
            y: 0.4 + Math.random() * 0.3,
          },
        })}
      />
      <SuccessScreen
        icon={badge ? <SuccessBadgeStyle src={badge} alt="" /> : undefined}
        title="Congratulations!"
        description={description}
        notice={notice}
        actions={
          <Button fullWidth onClick={fire}>
            Amazing!
          </Button>
        }
      />
    </>
  );
};

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { OperatorRef, useNodeOperator } from 'modules/web3';
import { FC, useCallback } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import { Suggestion, useOperatorSuggestions } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { useSwitchOperator } from 'shared/node-operator/use-switch-operator';
import { isSameOperator } from 'shared/node-operator/utils';
import { trackMatomoEvent } from 'utils';
import { SuggestionButton, SuggestionStyle } from './styles';

export const SuggestionsList: FC<{ operator: OperatorRef }> = ({
  operator,
}) => {
  const suggestions = useOperatorSuggestions(operator);
  const { nodeOperator } = useNodeOperator();
  const navigate = useNavigate();
  const switchTo = useSwitchOperator();

  const isActive = isSameOperator(operator, nodeOperator);

  const follow = useCallback(
    (s: Suggestion) => {
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.myOperatorsSuggestion);
      if (!isActive) switchTo(operator);
      void navigate(s.path);
    },
    [isActive, navigate, operator, switchTo],
  );

  if (suggestions.length === 0) return null;

  return (
    <Stack direction="column" gap="sm" data-testid="operatorSuggestions">
      {suggestions.map((s) => (
        <SuggestionStyle key={s.id} data-testid={`suggestion-${s.id}`}>
          <span>
            {s.text}
            {s.tooltip && <IconTooltip tooltip={s.tooltip} inline />}
          </span>
          <SuggestionButton type="button" onClick={() => follow(s)}>
            {s.cta}
          </SuggestionButton>
        </SuggestionStyle>
      ))}
    </Stack>
  );
};

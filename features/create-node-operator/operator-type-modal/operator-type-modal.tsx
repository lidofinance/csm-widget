import { Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPES_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { getUseModal, ModalComponentType } from 'providers/modal-provider';
import { MatomoLink, Stack } from 'shared/components';
import { CardsGrid, StyledModal } from './styles';
import { TypeCard } from './type-card';
import { useVisibleTypes } from './use-visible-types';

export const OperatorTypeModal: ModalComponentType = ({ open, onClose }) => {
  const types = useVisibleTypes();

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      $columns={types.length}
      title={
        <Stack direction="column" gap="xs">
          <Text as="h3" size="lg" weight={700}>
            Choose operator type
          </Text>
          <Text size="xxs">
            Check out details about{' '}
            <MatomoLink
              $inline
              data-testid="operatorTypesDocsLink"
              href={OPERATOR_TYPES_LINK}
              matomoEvent={MATOMO_CLICK_EVENTS_TYPES.operatorTypesDocsLink}
            >
              operator types and parameters
            </MatomoLink>{' '}
            to learn more.
          </Text>
        </Stack>
      }
    >
      <CardsGrid $columns={types.length}>
        {types.map((type) => (
          <TypeCard key={type.type} type={type} />
        ))}
      </CardsGrid>
    </StyledModal>
  );
};

export const useOperatorTypeModal = getUseModal(OperatorTypeModal);

import {
  OPERATOR_TYPE,
  OPERATOR_TYPE_CURVE_ID,
} from '@lidofinance/lido-csm-sdk';
import { Button, Divider, Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPES_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { getUseModal, ModalComponentType } from 'providers/modal-provider';
import { MatomoLink, Stack } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import { OptionCard, StackWrap, StyledModal } from './styles';
import { Parameters } from './parameters';

export const OperatorTypeModal: ModalComponentType = ({ open, onClose }) => {
  return (
    <StyledModal
      open={open}
      onClose={onClose}
      title={
        <Stack direction="column" gap="xs">
          <Text as="h3" size="lg" weight={700}>
            Choose operator type
          </Text>
          <Text size="xxs">
            Check out details about{' '}
            <MatomoLink href={OPERATOR_TYPES_LINK}>
              operator types and parameters
            </MatomoLink>{' '}
            to learn more.
          </Text>
        </Stack>
      }
    >
      <StackWrap>
        <OptionCard $variant={OPERATOR_TYPE.PLS}>
          <Stack direction="column">
            <Text size="sm" weight={700}>
              Permissionless
            </Text>
            <Text size="xxs">
              The simplest way to start validating in CSM. Upload keys under the
              general parameters without any permission or verification.At any
              point in the future, you may apply to become an Identified
              Community Staker to access more favorable parameters
            </Text>
            <Divider />
          </Stack>
          <Stack direction="column">
            <Parameters curveId={OPERATOR_TYPE_CURVE_ID.PLS} />
            <LocalLink
              href={PATH.CREATE}
              matomoEvent={
                MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless
              }
            >
              <Button fullwidth size="sm">
                Join permissionlessly
              </Button>
            </LocalLink>
          </Stack>
        </OptionCard>

        <OptionCard $variant={OPERATOR_TYPE.ICS}>
          <Stack direction="column">
            <Text size="sm" weight={700}>
              Identified Community Staker
            </Text>
            <Text size="xxs">
              Obtain enhanced validation parameters by becoming recognized as an
              independent Community Staker. Please note that the verification
              process takes time and requires the submission of specific
              supporting proofs
            </Text>
            <Divider />
          </Stack>
          <Stack direction="column">
            <Parameters curveId={OPERATOR_TYPE_CURVE_ID.ICS} />
            <LocalLink
              href={PATH.TYPE_ICS_APPLY}
              matomoEvent={MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIcs}
            >
              <Button fullwidth size="sm">
                Apply for ICS
              </Button>
            </LocalLink>
          </Stack>
        </OptionCard>
      </StackWrap>
    </StyledModal>
  );
};

export const useOperatorTypeModal = getUseModal(OperatorTypeModal);

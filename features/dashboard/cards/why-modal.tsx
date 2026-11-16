import { Modal, TextLink, Typography } from '@lidofinance/lido-app-ui';
import { LIDO_OPERATOR_PORTAL_PERFORMANCE_ORACLE } from 'consts/external-links';
import { MODULE_METADATA } from 'consts/module';
import { useModule } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import invariant from 'tiny-invariant';

const LIST_STYLE = { margin: 0, paddingLeft: 20 };

export const WhyModal: ModalComponentType = ({ open, onClose }) => {
  const { module } = useModule();
  invariant(module);
  const { shortName } = MODULE_METADATA[module];

  return (
    <Modal
      withOverlay
      open={open}
      onClose={onClose}
      title="Why didn’t I get rewards?"
      dataTestId={{ root: 'whyModal' }}
    >
      <Typography as="p" color="secondary">
        There are main reason of you getting no reward within a frame:
      </Typography>
      <Typography as="ol" color="secondary" style={LIST_STYLE}>
        <li>
          If your validator’s performance was below the threshold within the{' '}
          {shortName} Performance Oracle frame the validator does not receive
          rewards for the given frame. Read more about{' '}
          {/* TODO: temporary CSM Performance Oracle link; replace with a CM
              operator portal link (LIDO_OPERATOR_PORTAL_CM) once CM has one. */}
          <TextLink
            external
            size="inherit"
            href={LIDO_OPERATOR_PORTAL_PERFORMANCE_ORACLE}
          >
            the {shortName} Performance Oracle
          </TextLink>
          .
        </li>
      </Typography>
    </Modal>
  );
};

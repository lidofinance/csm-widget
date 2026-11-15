import { Modal, type ModalDataTestId } from '@lidofinance/lido-app-ui';
import type { FC, ReactNode } from 'react';

export type ModalCloseProps = {
  onClose?: () => void;
  closeOnEscape: boolean;
  closeOnOverlayClick: boolean;
};

export const getModalCloseProps = (
  isClosable: boolean,
  onClose?: () => void,
): ModalCloseProps => ({
  onClose: isClosable ? onClose : undefined,
  closeOnEscape: isClosable,
  closeOnOverlayClick: isClosable,
});

export type FormModalShellProps = {
  open?: boolean;
  onClose?: () => void;
  isClosable?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  dataTestId?: ModalDataTestId;
};

export const FormModalShell: FC<FormModalShellProps> = ({
  open,
  onClose,
  isClosable = true,
  title,
  subtitle,
  children,
  ...rest
}) => {
  if (!open || !children) return null;

  return (
    <Modal
      withOverlay
      title={title}
      subtitle={subtitle}
      {...getModalCloseProps(isClosable, onClose)}
      {...rest}
    >
      {children}
    </Modal>
  );
};

import { Modal } from '@lidofinance/lido-app-ui';
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
  'data-testid'?: string;
  'aria-labelledby'?: string;
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
  // app-ui Modal has no `open` prop: mounting is the parent's job
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

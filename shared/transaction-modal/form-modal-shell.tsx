import { Modal } from '@lidofinance/lido-app-ui';
import { Modal as LegacyModal } from '@lidofinance/lido-ui';
import type { FC, ReactNode } from 'react';
import type { FormUi } from 'shared/hook-form/form-ui';

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
  ui?: FormUi;
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
  ui = 'legacy',
  open,
  onClose,
  isClosable = true,
  title,
  subtitle,
  children,
  ...rest
}) => {
  if (ui === 'legacy') {
    return (
      <LegacyModal
        {...rest}
        title={title}
        subtitle={subtitle}
        open={open && Boolean(children)}
        onClose={isClosable ? onClose : undefined}
      >
        {children}
      </LegacyModal>
    );
  }

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

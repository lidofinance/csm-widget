import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOverlayClick?: boolean;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Card = styled.div`
  position: relative;
  background: var(--lido-color-foreground);
  color: var(--lido-color-textSecondary);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  max-width: 33rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem; /* Adjust to fine-tune positioning */
  right: 0.5rem; /* Adjust to fine-tune positioning */
  background: none;
  border: none;
  color: aliceblue;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.25rem;
`;

const ChildreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
  > h3 {
    font-size: 18px;
  }
  > div,
  > p {
    font-size: 14px;
  }
`;

export const LinkWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={closeOnOverlayClick ? onClose : undefined}>
      <Card onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ChildreWrapper>{children}</ChildreWrapper>
      </Card>
    </Overlay>
  );
};

export default Modal;

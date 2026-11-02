import styled from 'styled-components';

export const ConfirmTextStyle = styled.span`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ConfirmItemStyle = styled.span`
  display: block;
  color: var(--lido-app-ui-color-text-secondary);
`;

export const PermissionsStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 899px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const PermissionLabelStyle = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PermissionTitleStyle = styled.span`
  font-weight: var(--lido-app-ui-font-weight-bold);
`;

export const PermissionTextStyle = styled.span`
  display: block;
  color: var(--lido-app-ui-color-text-secondary);
  font-size: 12px;
  line-height: 20px;
`;

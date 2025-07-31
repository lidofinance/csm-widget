import styled, { css } from 'styled-components';

export const IconStyle = styled.span<{ inline?: boolean }>`
  line-height: 0;
  opacity: 0.7;

  ${({ inline }) =>
    inline
      ? css`
          display: ruby;
          vertical-align: middle;
          line-height: 16px;
        `
      : ''}
`;

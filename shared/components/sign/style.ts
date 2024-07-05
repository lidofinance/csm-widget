import styled from 'styled-components';

export const SignStyle = styled.div`
  flex-shrink: 0;
  width: 22px;
  align-content: center;
  text-align: center;

  color: var(--lido-color-textSecondary);
  line-height: 0;

  /* FIXME: need to fix this hack */
  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
    visibility: hidden;
  }
`;

import styled from 'styled-components';

export const ButtonStyle = styled.div`
  flex-shrink: 0;

  display: flex;
  padding: 7px 16px;
  justify-content: center;
  align-items: center;

  border-radius: 22px;
  background: radial-gradient(
      132.01% 229.66% at 51.78% 123.98%,
      #ef81f9 0%,
      rgba(249, 129, 183, 0) 100%
    ),
    linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%);

  color: var(--lido-color-primaryContrast);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 2.5em;
  font-weight: 700;
`;

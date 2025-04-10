import styled from 'styled-components';
import { MEDIA_QUERY_XXL } from 'styles/constants';

export const ExtraWidth = styled.div`
  width: 130%;

  ${MEDIA_QUERY_XXL} {
    width: 100%;
  }
`;

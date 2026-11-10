import { Body, Modal } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { ScoreSource } from '../shared';
import { Points } from './points';

type Props = {
  category: ScoreSource;
  onClose: () => void;
};

const ModalStyle = styled(Modal)`
  width: 680px;
  max-width: 100%;
`;

const RangeStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-bottom: 16px;
`;

const ItemsStyle = styled.ul`
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
`;

const ItemStyle = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 16px;

  & + & {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--lido-app-ui-color-border-default);
  }

  & > img {
    width: 40px;
    height: 40px;
  }
`;

const ItemBodyStyle = styled.div`
  flex: 1;
  min-width: 0;
`;

const DescriptionStyle = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: var(--lido-app-ui-color-text-secondary);
`;

export const CriteriaModal: FC<Props> = ({ category, onClose }) => (
  <ModalStyle
    withOverlay
    title={category.title}
    onClose={onClose}
    dataTestId={{ root: 'criteriaModal' }}
  >
    <RangeStyle>
      <Body weight="semibold">Minimum points: {category.min}</Body>
      <Body weight="semibold">Maximum points: {category.max}</Body>
    </RangeStyle>
    <Body color="secondary">{category.description}</Body>
    <ItemsStyle>
      {category.items.map((item) => (
        <ItemStyle key={item.id}>
          {item.icon}
          <ItemBodyStyle>
            <Body weight="semibold">{item.name}</Body>
            <DescriptionStyle>{item.description}</DescriptionStyle>
          </ItemBodyStyle>
          <Body weight="semibold" as="span">
            <Points value={item.points} />
          </Body>
        </ItemStyle>
      ))}
    </ItemsStyle>
  </ModalStyle>
);

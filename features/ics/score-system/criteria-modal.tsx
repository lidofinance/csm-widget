import { Body, Modal } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ScoreSource } from '../shared';
import { Points } from './points';
import s from './criteria-modal.module.css';

type Props = {
  category: ScoreSource;
  onClose: () => void;
};

export const CriteriaModal: FC<Props> = ({ category, onClose }) => (
  <Modal
    size="large"
    withOverlay
    title={category.title}
    onClose={onClose}
    dataTestId={{ root: 'criteriaModal' }}
  >
    <div className={s.range}>
      <Body weight="semibold">Minimum points: {category.min}</Body>
      <Body weight="semibold">Maximum points: {category.max}</Body>
    </div>
    <Body color="secondary">{category.description}</Body>
    <ul className={s.items}>
      {category.items.map((item) => (
        <li key={item.id} className={s.item}>
          {item.icon}
          <div className={s.itemBody}>
            <Body weight="semibold">{item.name}</Body>
            <div className={s.description}>{item.description}</div>
          </div>
          <Body weight="semibold" as="span">
            <Points value={item.points} />
          </Body>
        </li>
      ))}
    </ul>
  </Modal>
);

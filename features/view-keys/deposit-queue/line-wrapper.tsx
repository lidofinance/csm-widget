import { FC, PropsWithChildren } from 'react';
import { useGraphInteraction } from './hover-provider';
import { FarStyle, WrapperStyle } from './style';

type Props = { farAway: boolean };

export const LineWrapper: FC<PropsWithChildren<Props>> = ({
  children,
  farAway,
}) => {
  const { setFullView } = useGraphInteraction();
  return (
    <WrapperStyle onMouseLeave={() => setFullView(false)}>
      <FarStyle hidden={!farAway} onMouseEnter={() => setFullView(true)} />
      {children}
    </WrapperStyle>
  );
};

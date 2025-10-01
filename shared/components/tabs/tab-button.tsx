import { FC } from 'react';
import { TabButtonStyled } from './styles';
import { useTabsContext } from './tabs-context';
import { TabButtonProps } from './types';

export const TabButton: FC<TabButtonProps> = ({
  children,
  value,
  disabled = false,
  extra,
}) => {
  const { value: selectedValue, onValueChange } = useTabsContext();

  const isActive = selectedValue === value;

  const handleClick = () => {
    if (disabled) return;
    onValueChange?.(value);
  };

  return (
    <TabButtonStyled
      onClick={handleClick}
      disabled={disabled}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
      {extra}
    </TabButtonStyled>
  );
};

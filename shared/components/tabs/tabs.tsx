import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { TabListStyled, TabPanelStyled, TabsStyled } from './styles';
import { TabButton } from './tab-button';
import { TabsContext } from './tabs-context';
import { TabsProps } from './types';

export const Tabs: FC<TabsProps> = ({ items, defaultTab = 0, error }) => {
  const [currentTab, setCurrentTab] = useState<number>(defaultTab);

  useEffect(() => {
    const active = items[currentTab];
    if (!active || active.disabled) {
      setCurrentTab(defaultTab);
    }
  }, [currentTab, defaultTab, items]);

  const handleValueChange = useCallback((newTab: number) => {
    setCurrentTab(newTab);
  }, []);

  const contextValue = useMemo(
    () => ({
      value: currentTab,
      onValueChange: handleValueChange,
    }),
    [currentTab, handleValueChange],
  );

  const activeItem = items[currentTab];

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsStyled aria-invalid={!!error}>
        <TabListStyled>
          {items.map((item, index) => (
            <TabButton
              key={index}
              value={index}
              disabled={item.disabled}
              extra={item.extra}
              dataTestid={`tab-button-${item.title}`}
            >
              {item.title}
            </TabButton>
          ))}
        </TabListStyled>
        <TabPanelStyled>{activeItem?.content}</TabPanelStyled>
      </TabsStyled>
    </TabsContext.Provider>
  );
};

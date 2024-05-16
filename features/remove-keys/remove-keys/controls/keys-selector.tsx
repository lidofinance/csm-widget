import { ChangeEventHandler, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { RemoveKeysFormInputType } from '../context';
import { useRemoveKeysFormNetworkData } from '../context/use-remove-keys-form-network-data';
import { KeysItem } from './keys-item';

export const KeysSelector = () => {
  // const { isLoading } = useFormState<RemoveKeysFormInputType>();
  const { setValue, watch } = useFormContext<RemoveKeysFormInputType>();
  // const { fields } = useFieldArray<RemoveKeysFormInputType, 'keys'>({
  //   name: 'keys',
  // });
  const [start, count] = watch(['start', 'count']);

  const { keys, loading } = useRemoveKeysFormNetworkData();
  const isLoading = loading.isKeysLoading;

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.name;
      const m = name.match(/keys\.(\d+)\.checked/);
      const i = m?.[1] ? parseInt(m?.[1], 10) : 0;

      let newStart = start;
      let newCount = count;

      if (count === 0) {
        newStart = i;
        newCount = 1;
      } else if (i < start) {
        newStart = i;
        newCount = start + count - i;
      } else if (i >= start && i !== start + count - 1) {
        newCount = i - start + 1;
      } else if (i >= start && i === start + count - 1) {
        newCount = i - start;
      }

      setValue('start', newStart);
      setValue('count', newCount);
    },
    [count, setValue, start],
  );

  if (isLoading) {
    return <div>...loading...</div>;
  }

  return (
    <Wrapper>
      {keys?.map((key, index) => (
        <KeysItem
          key={key}
          index={index}
          title={key}
          name={`keys.${index}.checked`}
          checked={index >= start && index < start + count}
          onChange={onChange}
          // {...register(`keys.${index}.checked`, { deps: 'keys' })}
        />
      ))}
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px
    ${({ theme }) => theme.borderRadiusesMap.md}px 0 0;
  border: 1px solid var(--lido-color-foreground);
  border-bottom: none;
  overflow: hidden;
`;

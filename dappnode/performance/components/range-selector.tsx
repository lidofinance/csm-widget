import { useState } from 'react';
import { Dropdown, RangeDropdown, RangeWrapper } from './styles';
import { Range } from '../types';
import { ReactComponent as RoundedArrowIcon } from 'assets/icons/down-arrow.svg';

interface RangeSelectorProps {
  setRange: (value: Range) => void;
  range: Range;
  chainId: number;
}

export const RangeSelector = ({
  chainId,
  range,
  setRange,
}: RangeSelectorProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropDownOptions: Range[] =
    chainId !== 1
      ? ['week', 'month', 'year', 'ever']
      : ['month', 'year', 'ever'];

  const handleRangeSelect = (value: Range) => {
    setRange(value);
    setShowDropdown(false);
  };

  return (
    <RangeWrapper>
      RANGE:
      <RangeDropdown
        isOpen={showDropdown}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {range.substring(0, 1).toUpperCase() + range.substring(1)}
        <RoundedArrowIcon />
        {showDropdown && (
          <Dropdown>
            {dropDownOptions.map((r) => (
              <button key={r} onClick={() => handleRangeSelect(r)}>
                {r.substring(0, 1).toUpperCase() + r.substring(1)}
              </button>
            ))}
          </Dropdown>
        )}
      </RangeDropdown>
    </RangeWrapper>
  );
};

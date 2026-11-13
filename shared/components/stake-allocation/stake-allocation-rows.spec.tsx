import { renderToStaticMarkup } from 'react-dom/server';
import type { StakeAndKeysData } from 'utils/compute-stake-data';
import { StakeAllocationRows } from './stake-allocation-rows';

const data: StakeAndKeysData = {
  activeStake: 64n * 10n ** 18n,
  activeKeys: 1,
  depositableStake: 96n * 10n ** 18n,
  depositableKeys: 3,
  potentialAdditionalStake: 0n,
  potentialAdditionalKeys: 0,
  targetStake: 160n * 10n ** 18n,
  targetKeys: 3,
};

const render = (props: Parameters<typeof StakeAllocationRows>[0]) =>
  renderToStaticMarkup(<StakeAllocationRows {...props} />);

describe('StakeAllocationRows', () => {
  it('renders labels, row and keys testids and tooltips', () => {
    const html = render({ data });

    ['Active, ETH', 'Depositable, ETH', 'TSA, ETH'].forEach((label) =>
      expect(html).toContain(label),
    );
    [
      'stakeColumnActive',
      'stakeColumnDepositable',
      'stakeColumnTsa',
      'stakeColumnActiveKeys',
      'stakeColumnDepositableKeys',
      'stakeColumnTsaKeys',
    ].forEach((id) => expect(html).toContain(`data-testid="${id}"`));
    expect(html.match(/data-testid="iconTooltip"/g)).toHaveLength(3);
  });

  it('pluralises keys', () => {
    const html = render({ data });

    expect(html).toContain('1 key<');
    expect(html).toContain('3 keys');
  });

  it('hides keys while loading', () => {
    const html = render({ data: undefined });

    expect(html).not.toContain('Keys"');
    expect(html).toContain('Skeleton-module_text');
  });

  it('shows a dash and no keys on error', () => {
    const html = render({ data: undefined, error: true });

    expect(html).toContain('—');
    expect(html).not.toContain('Keys"');
  });
});

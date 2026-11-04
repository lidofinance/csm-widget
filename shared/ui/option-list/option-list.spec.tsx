import { renderToStaticMarkup } from 'react-dom/server';
import { OptionList } from './option-list';
import {
  OptionListItem,
  type OptionListOrientation,
  type OptionListVariant,
} from './option-list-item';

const radios = (html: string) =>
  html.match(/<div[^>]*role="radio"[^>]*>/g) ?? [];

const render = (
  value: string,
  variant?: OptionListVariant,
  orientation?: OptionListOrientation,
) =>
  renderToStaticMarkup(
    <OptionList
      value={value}
      onChange={() => undefined}
      variant={variant}
      orientation={orientation}
      aria-label="Operator type"
    >
      <OptionListItem value="a" title="Alpha" data-testid="gateCardPTO" />
      <OptionListItem value="b" title="Beta" description="Second" disabled />
      <OptionListItem value="c" title="Gamma">
        <span data-testid="gateCardBondParams">Bond:</span>
      </OptionListItem>
    </OptionList>,
  );

describe('OptionList', () => {
  it('renders a labelled radiogroup of radios', () => {
    const html = render('a');
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('aria-label="Operator type"');
    expect(radios(html)).toHaveLength(3);
  });

  it('marks only the selected item as checked and tabbable', () => {
    const [a, b, c] = radios(render('c'));
    expect(a).toContain('aria-checked="false"');
    expect(a).toContain('tabindex="-1"');
    expect(b).toContain('aria-disabled="true"');
    expect(b).toContain('tabindex="-1"');
    expect(c).toContain('aria-checked="true"');
    expect(c).toContain('tabindex="0"');
  });

  it('makes the first enabled item tabbable when nothing is selected', () => {
    const [a] = radios(render(''));
    expect(a).toContain('tabindex="0"');
  });

  it('puts data-testid and value on the radio root', () => {
    const [a] = radios(render('a'));
    expect(a).toContain('data-testid="gateCardPTO"');
    expect(a).toContain('data-value="a"');
  });

  it('renders description and free content', () => {
    const html = render('a');
    expect(html).toContain('Second');
    expect(html).toContain('data-testid="gateCardBondParams"');
  });

  it('renders the check indicator only in the cards variant', () => {
    expect(render('a', 'cards')).toContain('<svg');
    expect(render('a')).not.toContain('<svg');
  });

  it('marks a horizontal group with aria-orientation', () => {
    const group = (html: string) =>
      html.match(/<div[^>]*role="radiogroup"[^>]*>/)?.[0] ?? '';

    expect(group(render('a', 'list', 'horizontal'))).toContain(
      'aria-orientation="horizontal"',
    );
    expect(group(render('a'))).not.toContain('aria-orientation');
  });

  it('keeps radios and the cards indicator when horizontal', () => {
    const html = render('a', 'cards', 'horizontal');

    expect(radios(html)).toHaveLength(3);
    expect(html).toContain('<svg');
  });
});

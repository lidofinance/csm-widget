import { KEY_STATUS, type KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { KeyListField, KeyListFieldProps } from './key-list-field';

type Values = { selection: unknown };

const key = (
  hex: string,
  index: number,
  statuses: KEY_STATUS[],
): KeyWithStatus => ({
  pubkey: `0x${hex.repeat(96 / hex.length)}`,
  index,
  statuses,
});

const KEYS = [
  key('a1', 7, [KEY_STATUS.DEPOSITABLE]),
  key('b2', 8, [KEY_STATUS.DUPLICATED]),
  key('c3', 9, [KEY_STATUS.ACTIVE, KEY_STATUS.EJECTABLE]),
];

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const render = (
  selection: unknown,
  props: Partial<KeyListFieldProps> = {},
  errors?: FieldErrors<Values>,
) =>
  renderToStaticMarkup(
    <Host values={{ selection }} errors={errors}>
      <KeyListField
        name="selection"
        mode="range"
        options={KEYS}
        aria-label="Keys to remove"
        data-testid="keysList"
        {...props}
      />
    </Host>,
  );

const labels = (html: string) =>
  html.match(
    /<div class="CheckboxRow-module_row[\s\S]*?(?=<div class="CheckboxRow-module_row|<\/div><\/div>$)/g,
  ) ?? [];
// lib Checkbox also renders a hidden indeterminate (minus) glyph
const svgCount = (fragment: string) =>
  fragment.match(/<svg(?![^>]*_minus)/g)?.length ?? 0;

describe('KeyListField', () => {
  it('renders one labelled checkbox row per key in a named group', () => {
    const html = render({ start: 0, count: 0 });

    expect(html).toMatch(
      /<div[^>]*data-testid="keysList"[^>]*role="group"[^>]*aria-label="Keys to remove"/,
    );
    expect(labels(html)).toHaveLength(3);
  });

  it('keeps exactly one svg (the tick) inside each row label', () => {
    labels(render({ start: 0, count: 0 })).forEach((label) => {
      expect(svgCount(label)).toBe(1);
    });
  });

  it('shows the pubkey with the e2e trimming and the full key as title', () => {
    const [first] = labels(render({ start: 0, count: 0 }));

    expect(first).toContain(`title="${KEYS[0].pubkey}"`);
    expect(first).toContain('0xa1a1a1a1a1a1a1...a1a1a1a1a1a1a1a1');
  });

  it('checks the keys inside the range by list position', () => {
    const [a, b, c] = labels(render({ start: 1, count: 2 }));

    expect(a).not.toContain('checked=""');
    expect(b).toContain('checked=""');
    expect(c).toContain('checked=""');
  });

  it('checks the keys whose index is selected in multi mode', () => {
    const [a, b, c] = labels(render([9], { mode: 'multi' }));

    expect(a).not.toContain('checked=""');
    expect(b).not.toContain('checked=""');
    expect(c).toContain('checked=""');
  });

  it('renders status tags from getTags', () => {
    const html = render(
      { start: 0, count: 0 },
      {
        getTags: (item) =>
          item.statuses.filter((status) => status === KEY_STATUS.DUPLICATED),
      },
    );

    expect(html).toContain('>Duplicated</span>');
    expect(html).not.toContain('>Active</span>');
  });

  it('disables keys and puts the hint outside their label', () => {
    const html = render([], {
      mode: 'multi',
      isDisabled: (item) => !item.statuses.includes(KEY_STATUS.EJECTABLE),
      disabledHint:
        'Only keys that have been active for at least 256 epochs (~27 hours) can be exited',
    });
    const [a, , c] = labels(html);

    expect(a).toContain('disabled=""');
    expect(c).not.toContain('disabled=""');
    (html.match(/<label[\s\S]*?<\/label>/g) ?? []).forEach((label) =>
      expect(svgCount(label)).toBe(1),
    );
    expect(svgCount(html)).toBe(5);
  });

  it('hides the error until the field is touched or submitted', () => {
    const html = render(
      { start: 0, count: 0 },
      {},
      { selection: { type: 'VALIDATE', message: 'No keys selected' } },
    );

    expect(html).not.toContain('inputMessageError');
    expect(html).not.toContain('aria-describedby');
  });
});

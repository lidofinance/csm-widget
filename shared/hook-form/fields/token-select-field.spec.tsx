import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { parseEther } from 'viem';
import { getBondTokenOptions } from './bond-token-options';
import {
  TOKEN_SELECT_TRIGGER_SELECTOR,
  TokenSelectField,
} from './token-select-field';

type Values = { token: TOKENS };

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const options = getBondTokenOptions({
  ethBalance: parseEther('1'),
  stethBalance: parseEther('24.1912'),
  wstethBalance: parseEther('3'),
  keysAvailable: { [TOKENS.steth]: { count: 2 } },
});

const render = (errors?: FieldErrors<Values>) =>
  renderToStaticMarkup(
    <Host values={{ token: TOKENS.steth }} errors={errors}>
      <TokenSelectField
        name="token"
        options={options}
        label="Choose bond token"
        action={<a href="#how-much-bond-is-needed">How bond is calculated</a>}
      />
    </Host>,
  );

describe('TokenSelectField', () => {
  it('renders the title row with its action', () => {
    const html = render();

    expect(html).toContain('>Choose bond token</p>');
    expect(html).toContain('How bond is calculated</a>');
  });

  it('shows the selected token in the trigger', () => {
    const trigger =
      render().match(
        /<button[^>]*data-testid="tokenSelectTrigger"[\s\S]*?<\/button>/,
      )?.[0] ?? '';

    expect(trigger).toContain('aria-haspopup="listbox"');
    expect(trigger).toContain('24.1912 stETH');
    expect(trigger).toContain('2 keys');
  });

  it('targets the trigger button, not the title action link, for focus', () => {
    const html = render();

    expect(TOKEN_SELECT_TRIGGER_SELECTOR).toBe(
      '[data-testid="tokenSelectTrigger"]',
    );
    expect(html).toMatch(/<button[^>]*data-testid="tokenSelectTrigger"/);
    expect(html.indexOf('<a href')).toBeLessThan(
      html.indexOf('data-testid="tokenSelectTrigger"'),
    );
  });

  it('keeps the options panel closed on first render', () => {
    expect(render()).not.toContain('role="listbox"');
  });

  it('renders no error without one', () => {
    expect(render()).not.toContain('inputMessageError');
  });

  it('renders the resolver error under the selector', () => {
    const html = render({
      token: { type: 'VALIDATE', message: 'Not enough stETH' },
    });

    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('>Not enough stETH</p>');
  });
});

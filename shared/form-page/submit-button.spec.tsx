import { FC, PropsWithChildren, ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormProvider, useForm } from 'react-hook-form';
import { SubmitButton } from './submit-button';

let mockIsAccountActive = true;

jest.mock('modules/web3', () => ({
  useDappStatus: () => ({ isAccountActive: mockIsAccountActive }),
}));

jest.mock('shared/wallet/connect/use-connect-wallet', () => ({
  useConnectWallet: () => ({ handleClick: jest.fn(), disabled: false }),
}));

const Host: FC<PropsWithChildren> = ({ children }) => {
  const form = useForm();
  return <FormProvider {...form}>{children}</FormProvider>;
};

const render = (node: ReactElement) =>
  renderToStaticMarkup(<Host>{node}</Host>);

beforeEach(() => {
  mockIsAccountActive = true;
});

it('renders an enabled submit button with its label', () => {
  const html = render(
    <SubmitButton data-testid="submitBtn">Submit</SubmitButton>,
  );
  expect(html).toContain('type="submit"');
  expect(html).toContain('data-testid="submitBtn"');
  expect(html).toContain('Submit');
  expect(html).not.toContain('disabled=""');
});

it('replaces the label with the disabled reason and disables', () => {
  const html = render(
    <SubmitButton disabledReason="Keys limit has reached">Submit</SubmitButton>,
  );
  expect(html).toContain('Keys limit has reached');
  expect(html).not.toContain('>Submit<');
  expect(html).toContain('disabled=""');
});

it('renders a plain button for a secondary intent', () => {
  const html = render(<SubmitButton intent="claim">Claim</SubmitButton>);
  expect(html).toContain('type="button"');
});

it('renders the connect button when the wallet is not active', () => {
  mockIsAccountActive = false;
  const html = render(<SubmitButton>Submit</SubmitButton>);
  expect(html).toContain('data-testid="connectBtn"');
  expect(html).toContain('Connect wallet');
  expect(html).not.toContain('Submit');
});

import { renderToStaticMarkup } from 'react-dom/server';
import { AfterAddressProposed } from './after-address-proposed';

vi.mock('shared/hooks/use-module-meta', () => ({
  useModuleMeta: () => ({ shortTitle: 'CSM' }),
}));

const ADDRESS = '0x81e5ca00000000000000000000000000000a23d7';

const render = () =>
  renderToStaticMarkup(<AfterAddressProposed address={ADDRESS} />);

describe('AfterAddressProposed', () => {
  it('keeps the e2e copy', () => {
    const html = render();

    expect(html).toContain('What is next:');
    expect(html).toContain('Connect to CSM UI with the proposed address');
    expect(html).toContain(
      'Go to Settings tab → Inbox requests to confirm the change',
    );
  });

  it('renders the app-ui address', () => {
    const html = render();

    expect(html).toContain('Address-module_root');
    expect(html).toContain('0x81e5ca...0a23d7');
  });
});

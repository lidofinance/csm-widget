import { AccessLevel, type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { renderToStaticMarkup } from 'react-dom/server';
import { NoAccessNotice } from './no-access-notice';

let mockExtended = false;

vi.mock('modules/web3', () => ({
  useNodeOperator: () => ({
    nodeOperator: { extendedManagerPermissions: mockExtended },
  }),
}));

const access = (level: AccessLevel) => ({ level }) as unknown as MethodAccess;

beforeEach(() => {
  mockExtended = false;
});

describe('NoAccessNotice', () => {
  it('names the role that may act', () => {
    const html = renderToStaticMarkup(
      <NoAccessNotice access={access(AccessLevel.MANAGER)} />,
    );

    expect(html).toContain('data-testid="noAccessNotice"');
    expect(html).toContain(
      'This action can only be performed by the <b>Manager</b> Address of the Node Operator',
    );
  });

  it('resolves the owner role from extended manager permissions', () => {
    mockExtended = true;
    expect(
      renderToStaticMarkup(
        <NoAccessNotice access={access(AccessLevel.OWNER)} />,
      ),
    ).toContain('<b>Manager</b>');
  });

  it('asks to connect a wallet when anyone may act', () => {
    expect(
      renderToStaticMarkup(
        <NoAccessNotice access={access(AccessLevel.ANYONE)} />,
      ),
    ).toContain('Please connect your wallet to perform this action');
  });

  it('explains a protocol role', () => {
    expect(
      renderToStaticMarkup(
        <NoAccessNotice access={access(AccessLevel.PROTOCOL_ROLE)} />,
      ),
    ).toContain('This action requires a protocol-level permission');
  });

  it('renders children instead of the default copy', () => {
    const html = renderToStaticMarkup(
      <NoAccessNotice
        access={access(AccessLevel.MANAGER)}
        data-testid="customNotice"
      >
        Only the CMC can enable top-ups
      </NoAccessNotice>,
    );

    expect(html).toContain('data-testid="customNotice"');
    expect(html).toContain('Only the CMC can enable top-ups');
    expect(html).not.toContain('can only be performed');
  });
});

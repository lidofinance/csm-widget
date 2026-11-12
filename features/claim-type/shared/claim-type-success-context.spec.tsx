vi.mock('modules/web3', () => ({
  useNodeOperatorId: () => 1,
  useModule: () => ({ module: 'csm' }),
}));

import { renderToStaticMarkup } from 'react-dom/server';
import {
  ClaimTypeSuccessProvider,
  useClaimTypeSuccess,
} from './claim-type-success-context';

const Probe = () => {
  const { justClaimed } = useClaimTypeSuccess();
  return <i>{String(justClaimed)}</i>;
};

describe('ClaimTypeSuccessProvider', () => {
  it('starts unclaimed', () => {
    expect(
      renderToStaticMarkup(
        <ClaimTypeSuccessProvider>
          <Probe />
        </ClaimTypeSuccessProvider>,
      ),
    ).toBe('<i>false</i>');
  });

  it('throws outside the provider', () => {
    expect(() => renderToStaticMarkup(<Probe />)).toThrow(
      'useClaimTypeSuccess was used outside ClaimTypeSuccessProvider',
    );
  });
});

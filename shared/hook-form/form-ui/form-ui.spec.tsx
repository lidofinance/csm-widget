import { renderToStaticMarkup } from 'react-dom/server';
import { AppFormUi, FormUiProvider, useFormUi } from './form-ui';

const Probe = () => <>{useFormUi()}</>;

describe('useFormUi', () => {
  it('defaults to legacy', () => {
    expect(renderToStaticMarkup(<Probe />)).toBe('legacy');
  });

  it('reads app under AppFormUi', () => {
    expect(
      renderToStaticMarkup(
        <AppFormUi>
          <Probe />
        </AppFormUi>,
      ),
    ).toBe('app');
  });

  it('lets a nested provider override the value', () => {
    expect(
      renderToStaticMarkup(
        <AppFormUi>
          <FormUiProvider value="legacy">
            <Probe />
          </FormUiProvider>
        </AppFormUi>,
      ),
    ).toBe('legacy');
  });
});

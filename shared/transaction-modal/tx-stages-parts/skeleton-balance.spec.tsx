import { renderToStaticMarkup } from 'react-dom/server';
import { SkeletonBalance } from './skeleton-balance';

describe('SkeletonBalance', () => {
  it('renders the app-ui text skeleton', () => {
    const html = renderToStaticMarkup(<SkeletonBalance />);

    expect(html).toContain('Skeleton-module_text');
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { WhatsNextBlock } from './whats-next-block';

describe('WhatsNextBlock', () => {
  it('renders an app-ui message box with the steps', () => {
    const html = renderToStaticMarkup(
      <WhatsNextBlock>
        <li>STEP ONE</li>
        <li>STEP TWO</li>
      </WhatsNextBlock>,
    );

    expect(html).toContain('MessageBox-module_box');
    expect(html).toContain('What is next:');
    expect(html).toContain('<ol><li>STEP ONE</li><li>STEP TWO</li></ol>');
    expect(html).not.toContain('<b>');
  });
});

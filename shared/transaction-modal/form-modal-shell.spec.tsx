import { renderToStaticMarkup } from 'react-dom/server';
import { FormModalShell, getModalCloseProps } from './form-modal-shell';

describe('getModalCloseProps', () => {
  it('passes onClose and enables Escape and overlay close when closable', () => {
    const onClose = vi.fn();
    expect(getModalCloseProps(true, onClose)).toEqual({
      onClose,
      closeOnEscape: true,
      closeOnOverlayClick: true,
    });
  });

  it('drops onClose and disables Escape and overlay close when locked', () => {
    expect(getModalCloseProps(false, vi.fn())).toEqual({
      onClose: undefined,
      closeOnEscape: false,
      closeOnOverlayClick: false,
    });
  });
});

describe('FormModalShell app', () => {
  it('renders nothing without children', () => {
    expect(renderToStaticMarkup(<FormModalShell ui="app" open />)).toBe('');
  });

  it('renders nothing when closed', () => {
    expect(
      renderToStaticMarkup(
        <FormModalShell ui="app" open={false}>
          body
        </FormModalShell>,
      ),
    ).toBe('');
  });

  it('mounts the portaled modal when open with children', () => {
    expect(
      renderToStaticMarkup(
        <FormModalShell ui="app" open>
          body
        </FormModalShell>,
      ),
    ).not.toBe('');
  });
});

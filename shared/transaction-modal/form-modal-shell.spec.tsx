import { renderToStaticMarkup } from 'react-dom/server';
import { FormModalShell, getModalCloseProps } from './form-modal-shell';

describe('getModalCloseProps', () => {
  it('passes onClose and sets dismissible when closable', () => {
    const onClose = vi.fn();
    expect(getModalCloseProps(true, onClose)).toEqual({
      onClose,
      dismissible: true,
    });
  });

  it('drops onClose and sets dismissible false when locked', () => {
    expect(getModalCloseProps(false, vi.fn())).toEqual({
      onClose: undefined,
      dismissible: false,
    });
  });
});

describe('FormModalShell app', () => {
  it('renders nothing without children', () => {
    expect(renderToStaticMarkup(<FormModalShell open />)).toBe('');
  });

  it('renders nothing when closed', () => {
    expect(
      renderToStaticMarkup(<FormModalShell open={false}>body</FormModalShell>),
    ).toBe('');
  });

  it('mounts the portaled modal when open with children', () => {
    expect(
      renderToStaticMarkup(<FormModalShell open>body</FormModalShell>),
    ).not.toBe('');
  });
});

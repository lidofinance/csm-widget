import { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Faq as FaqItem } from 'types';
import { FaqDrawer, hasFaqAnchor } from './faq-drawer';

const items: FaqItem[] = [
  { title: 'A', anchor: 'a', content: null },
  { title: 'B', anchor: 'b', content: null },
];

const nav = {
  hashNav: '',
  resetInpageAnchor: vi.fn(),
  resetSpecificAnchor: vi.fn(),
  scrollToAnchor: vi.fn(),
  navigateInpageAnchor: vi.fn(),
};

const state = {
  items: null as FaqItem[] | null,
  open: false,
  setOpen: vi.fn(),
};

let drawerProps: { open: boolean; onClose: () => void; children: ReactNode };

vi.mock('providers/inpage-navigation', () => ({
  useInpageNavigation: () => nav,
}));

vi.mock('./faq-provider', () => ({
  useFaqState: () => state,
}));

vi.mock('@lidofinance/lido-app-ui', async (orig) => ({
  ...(await orig<object>()),
  Drawer: (p: typeof drawerProps) => {
    drawerProps = p;
    return <div data-testid="drawer">{p.open ? p.children : null}</div>;
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  nav.hashNav = '';
  state.items = null;
  state.open = false;
});

describe('hasFaqAnchor', () => {
  it('is false for an empty hash', () => {
    expect(hasFaqAnchor(items, '')).toBe(false);
    expect(hasFaqAnchor(items, undefined)).toBe(false);
  });

  it('is false for null items', () => {
    expect(hasFaqAnchor(null, 'a')).toBe(false);
  });

  it('is false for a non-matching anchor', () => {
    expect(hasFaqAnchor(items, 'zzz')).toBe(false);
  });

  it('is true for a matching anchor', () => {
    expect(hasFaqAnchor(items, 'b')).toBe(true);
  });
});

describe('FaqDrawer', () => {
  it('renders nothing without items', () => {
    expect(renderToStaticMarkup(<FaqDrawer />)).toBe('');
  });

  it('renders the FAB with items', () => {
    state.items = items;
    expect(renderToStaticMarkup(<FaqDrawer />)).toContain(
      'data-testid="faqButton"',
    );
  });

  it('close resets a matching anchor', () => {
    state.items = items;
    nav.hashNav = 'a';
    renderToStaticMarkup(<FaqDrawer />);
    drawerProps.onClose();
    expect(state.setOpen).toHaveBeenCalledWith(false);
    expect(nav.resetInpageAnchor).toHaveBeenCalled();
  });

  it('close keeps a non-matching anchor', () => {
    state.items = items;
    nav.hashNav = 'zzz';
    renderToStaticMarkup(<FaqDrawer />);
    drawerProps.onClose();
    expect(state.setOpen).toHaveBeenCalledWith(false);
    expect(nav.resetInpageAnchor).not.toHaveBeenCalled();
  });
});

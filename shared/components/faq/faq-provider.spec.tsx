import { renderToStaticMarkup } from 'react-dom/server';
import { Faq as FaqItem } from 'types';
import { FaqProvider, releaseFaq, useRegisterFaq } from './faq-provider';

const a: FaqItem[] = [{ title: 'A', anchor: 'a', content: null }];
const b: FaqItem[] = [{ title: 'B', anchor: 'b', content: null }];

const mocks = vi.hoisted(() => ({
  register: vi.fn(),
  setOpen: vi.fn(),
  setItems: vi.fn(),
}));

// renderToStaticMarkup skips effects and state updates; run effects synchronously and spy on setters
vi.mock('react', async (orig) => ({
  ...(await orig<object>()),
  useEffect: (fn: () => void) => {
    fn();
  },
  useLayoutEffect: (fn: () => void) => {
    fn();
  },
  useContext: () => mocks.register,
  useState: (init: unknown) => [
    init,
    init === false ? mocks.setOpen : mocks.setItems,
  ],
}));

beforeEach(() => vi.clearAllMocks());

describe('releaseFaq', () => {
  it('clears its own registration', () => {
    expect(releaseFaq(a)(a)).toBeNull();
  });

  it('keeps a newer registration', () => {
    expect(releaseFaq(a)(b)).toBe(b);
  });

  it('keeps empty state empty', () => {
    expect(releaseFaq(a)(null)).toBeNull();
  });
});

describe('useRegisterFaq', () => {
  const Consumer = ({ items }: { items: FaqItem[] }) => {
    useRegisterFaq(items);
    return null;
  };

  it('registers a non-empty list', () => {
    renderToStaticMarkup(<Consumer items={a} />);
    expect(mocks.register).toHaveBeenCalledWith(a);
  });

  it('skips an empty list', () => {
    renderToStaticMarkup(<Consumer items={[]} />);
    expect(mocks.register).not.toHaveBeenCalled();
  });
});

describe('FaqProvider', () => {
  it('closes the drawer when no items are registered', () => {
    renderToStaticMarkup(<FaqProvider>{null}</FaqProvider>);
    expect(mocks.setOpen).toHaveBeenCalledWith(false);
  });
});

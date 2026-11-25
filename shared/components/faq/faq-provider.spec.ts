import { Faq as FaqItem } from 'types';
import { releaseFaq } from './faq-provider';

const a: FaqItem[] = [{ title: 'A', anchor: 'a', content: null }];
const b: FaqItem[] = [{ title: 'B', anchor: 'b', content: null }];

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

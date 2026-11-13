import { sortGroupMembers } from './sort-group-members';

const make = (ids: number[]) =>
  ids.map((id) => ({ nodeOperatorId: BigInt(id) }));
const ids = (list: { nodeOperatorId: bigint }[]) =>
  list.map((m) => Number(m.nodeOperatorId));

describe('sortGroupMembers', () => {
  const members = make([5, 2, 9, 3, 7]);
  const availableIds = new Set([7n, 3n]);

  it('puts active first, then available, then the rest ascending', () => {
    expect(
      ids(sortGroupMembers(members, { activeId: 9n, availableIds })),
    ).toEqual([9, 3, 7, 2, 5]);
  });

  it('sorts without an active id', () => {
    expect(ids(sortGroupMembers(members, { availableIds }))).toEqual([
      3, 7, 2, 5, 9,
    ]);
  });

  it('ignores an active id absent from the list', () => {
    expect(
      ids(sortGroupMembers(members, { activeId: 100n, availableIds })),
    ).toEqual([3, 7, 2, 5, 9]);
  });

  it('does not mutate the input', () => {
    const input = make([5, 2, 9]);
    sortGroupMembers(input, { activeId: 9n, availableIds });
    expect(ids(input)).toEqual([5, 2, 9]);
  });
});

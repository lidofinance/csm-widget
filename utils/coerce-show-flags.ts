import type { ShowFlags, ShowFlagsState } from 'shared/hooks';

// Collapse the tri-state ShowFlagsState (a still-loading flag is `undefined`)
// into definite booleans — `undefined` → `false`. Kept a zero-dependency module
// (import it directly, not via the shared/hooks barrel, to keep it loadable in
// isolation — route-terminal.ts pulls it into the jest route-consistency test
// without dragging in the SDK-heavy hooks graph).
export const coerceShowFlags = (state: ShowFlagsState): ShowFlags =>
  Object.fromEntries(
    Object.entries(state).map(([rule, value]) => [rule, !!value]),
  ) as ShowFlags;

# APY Metrics Implementation Plan

## Overview

Implement APY (Annual Percentage Yield) display in the Bond & Rewards section, inspired by the third-party [lido-csm-dashboard](https://github.com/0xdespot/lido-csm-dashboard). This addresses community feedback for "single pane of glass" performance monitoring and helps operators validate their staking returns.

## Current State

### Existing Bond Section

**File**: [features/dashboard/bond/bond-section.tsx](features/dashboard/bond/bond-section.tsx)

Current components:

- `<AvailableToClaim>` - Shows claimable amount (rewards + excess bond - locked)
- `<BondBalance>` - Shows current bond vs required bond
- `<LastRewards>` - Shows latest distribution frame with validator performance

### Available Data Hooks

**Location**: [modules/web3/hooks/](modules/web3/hooks/)

- ✅ `useOperatorRewardsHistory()` - Returns array of `ValidatorRewardsEntity[]` with historical rewards
- ✅ `useOperatorLastRewards()` - Latest frame: distributed amount, validator counts, threshold
- ✅ `useOperatorBalance()` - Bond amounts (current, required, excess)
- ✅ `useFrameInfo()` - Frame timing (lastReport, frameDuration, nextDistribution)

### ValidatorRewardsEntity Type

From `@lidofinance/lido-csm-sdk`:

```typescript
type ValidatorRewardsEntity = {
  fee: bigint; // Reward amount for this frame
  startTimestamp: number; // Frame start timestamp
  endTimestamp: number; // Frame end timestamp
  receivedRewards: bigint; // Total received
  pubkey: Hex | undefined;
  // ... other fields
};
```

## APY Calculation Methodology

### Reward APY Formula

Based on third-party dashboard approach:

```
Reward APY = (rewards / bond) * (365 / frame_days) * 100
```

Where:

- `rewards` = distributed amount for frame (stETH)
- `bond` = required bond for frame (stETH)
- `frame_days` = (endTimestamp - startTimestamp) / 86400
- Annualized by multiplying by `365 / frame_days`

### Multi-Frame Views

1. **Current Frame APY**: Using latest distribution data
2. **Previous Frame APY**: Using second-to-last distribution
3. **Lifetime APY**: Duration-weighted average across all frames

For lifetime calculation:

```
Lifetime APY = Σ(frame_apy * frame_days) / total_days
```

This accounts for operators who increased validator counts over time, weighting each frame's APY by its duration.

## Implementation Plan

### Phase 1: Create APY Hook

**New File**: `modules/web3/hooks/use-operator-apy.ts`

**Purpose**: Calculate APY metrics from rewards history

**Implementation**:

```typescript
export const useOperatorApy = (nodeOperatorId: NodeOperatorId | undefined) => {
  const { data: rewardsHistory } = useOperatorRewardsHistory(nodeOperatorId);
  const { data: balance } = useOperatorBalance(nodeOperatorId);

  return useQuery({
    queryKey: ['operator-apy', { nodeOperatorId }],
    enabled: !!rewardsHistory && !!balance,
    queryFn: () => {
      const frames = groupRewardsByFrame(rewardsHistory);

      // Calculate APY for each frame
      const currentFrameApy = calculateFrameApy(frames[0], balance.required);
      const previousFrameApy = calculateFrameApy(frames[1], balance.required);
      const lifetimeApy = calculateLifetimeApy(frames, balance.required);

      return {
        current: currentFrameApy,
        previous: previousFrameApy,
        lifetime: lifetimeApy,
        change: currentFrameApy - previousFrameApy, // For trend display
      };
    },
  });
};
```

**Helper Functions**:

- `groupRewardsByFrame()` - Group `ValidatorRewardsEntity[]` by frame (using timestamps)
- `calculateFrameApy()` - Calculate single frame APY using formula above
- `calculateLifetimeApy()` - Duration-weighted average across all frames

### Phase 2: Create APY Component

**New File**: `features/dashboard/bond/apy-metrics.tsx`

**Purpose**: Display APY metrics with tooltips

**UI Design**:

```
┌─────────────────────────────────────┐
│ APY Metrics                     [?] │
├─────────────────────────────────────┤
│ Current Frame        5.2%   ↑ 0.3% │
│ Previous Frame       4.9%           │
│ Lifetime Average     5.1%           │
└─────────────────────────────────────┘
```

**Features**:

- Tooltip on [?] explaining APY calculation
- Trend indicator (↑/↓) comparing current vs previous
- Color coding: green for positive change, red for negative
- Loading states while data fetches
- Handle edge cases: no history, single frame, zero bond

**Component Structure**:

```typescript
export const ApyMetrics: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: apy, isPending } = useOperatorApy(nodeOperatorId);

  return (
    <AccordionStyle
      summary={<RowHeader with APY title and current value>}
    >
      <Stack direction="column" gap="md">
        <TextBlock title="Current Frame" value={apy.current} />
        <TextBlock title="Previous Frame" value={apy.previous} />
        <TextBlock title="Lifetime Average" value={apy.lifetime} />
      </Stack>
    </AccordionStyle>
  );
};
```

### Phase 3: Integrate into Bond Section

**Modified File**: `features/dashboard/bond/bond-section.tsx`

**Changes**:

```typescript
import { ApyMetrics } from './apy-metrics';

export const BondSection: FC = () => {
  return (
    <SectionBlock title="Bond & Rewards" href={PATH.BOND}>
      <Stack direction="column" gap="md">
        <AvailableToClaim />
        <BondBalance />
        <ApyMetrics />  {/* NEW */}
        <LastRewards />
      </Stack>
    </SectionBlock>
  );
};
```

Position between `<BondBalance>` and `<LastRewards>` for logical flow: bond status → APY performance → detailed rewards.

### Phase 4: Add Matomo Tracking

**Modified File**: `consts/matomo-click-events.ts`

Add event types:

- `apyMetricsExpanded` - Track accordion expansion
- `apyMetricsTooltipViewed` - Track tooltip interactions

### Phase 5: Export Hook from Index

**Modified File**: `modules/web3/hooks/index.ts`

Add:

```typescript
export { useOperatorApy } from './use-operator-apy';
```

## Files to Create

1. `modules/web3/hooks/use-operator-apy.ts` - APY calculation hook
2. `features/dashboard/bond/apy-metrics.tsx` - APY display component

## Files to Modify

1. `features/dashboard/bond/bond-section.tsx` - Add `<ApyMetrics>` component
2. `modules/web3/hooks/index.ts` - Export new hook
3. `consts/matomo-click-events.ts` - Add tracking events (optional)

## Edge Cases & Error Handling

### No Rewards History

- Display "No rewards data yet" with helper text
- Show once operator has at least one distribution

### Single Frame Only

- Show only "Current Frame APY"
- Hide previous and lifetime (or show N/A)

### Zero Bond Requirement

- APY calculation would divide by zero
- Display "—" or "N/A" with tooltip explaining bond requirement needed

### Very High APY (>100%)

- Can occur with small bond and large rewards
- Cap display at reasonable maximum or show as ">100%"

### Negative Rewards

- Possible if operator had MEV stealing penalties
- Handle gracefully, show negative APY or "Penalties applied"

## Verification Plan

### Unit Tests

**New File**: `modules/web3/hooks/use-operator-apy.test.ts`

Test scenarios:

1. Calculate APY for single frame correctly
2. Calculate lifetime APY with multiple frames
3. Handle empty rewards history
4. Handle zero bond requirement
5. Verify duration weighting in lifetime calculation

### Integration Tests

**New File**: `features/dashboard/bond/apy-metrics.test.tsx`

Test scenarios:

1. Component renders with loading state
2. Component displays APY values correctly
3. Trend indicator shows up/down correctly
4. Tooltip displays and explains calculation
5. Accordion expands/collapses

### E2E Tests

**Modified File**: `tests/widget/operatorWithValidator/dashboard/bondRewards/apy.spec.ts` (new)

Test scenarios:

1. Navigate to dashboard
2. Verify APY Metrics section visible
3. Expand accordion
4. Verify current/previous/lifetime values displayed
5. Compare calculated values with expected (using test operator data)

### Manual Testing Checklist

1. **With test operator**:

   - View APY metrics on dashboard
   - Verify values match manual calculation
   - Check tooltip explanations
   - Test accordion interaction

2. **With different operator types**:

   - New operator (no history) - graceful empty state
   - Single frame operator - shows current only
   - Multi-frame operator - shows all three values
   - Operator with varying bond - duration-weighted correctly

3. **Performance**:

   - Dashboard loads without delay
   - APY calculation doesn't block rendering
   - React Query caching works (no refetch on navigate back)

4. **Responsive design**:
   - Mobile view (< 768px)
   - Tablet view (768-1024px)
   - Desktop view (> 1024px)

## Success Criteria

1. ✅ APY values match third-party dashboard calculations (within 0.1%)
2. ✅ Component follows existing design patterns (`AccordionStyle`, `TextBlock`, etc.)
3. ✅ Loading states and error handling consistent with other bond components
4. ✅ Tooltip provides clear explanation of APY calculation
5. ✅ No performance regression on dashboard load
6. ✅ Works across all operator types and edge cases
7. ✅ Matomo tracking captures user interactions

## Future Enhancements (Out of Scope)

Not included in this initial implementation:

- **Bond APY**: Requires stETH rebase rate data (may need The Graph integration)
- **Net APY**: Combined reward + bond APY
- **APY Chart**: Historical APY trend visualization
- **Distribution History Table**: Detailed frame-by-frame breakdown
- **Claim History**: Transaction timeline of claims/withdrawals

These can be added iteratively based on user feedback.

## Technical Notes

### Why Duration-Weighted Lifetime APY?

Operators may start with 1 validator and grow to 10+ over time. Simple averaging would over-weight early low-balance periods. Duration weighting ensures recent performance with larger bond has appropriate influence on lifetime metrics.

### Why Not Bond APY Initially?

stETH rebasing is constant across all operators and doesn't differentiate operator performance. Reward APY is the operator-specific metric. Bond APY can be added later using current stETH APR (available from Lido API or The Graph).

### Performance Considerations

- `useOperatorRewardsHistory()` may return large arrays (100+ frames for early operators)
- Calculate APY in `queryFn` so React Query caches result
- Consider `useMemo` for expensive calculations if needed
- Grouping by frame reduces per-validator iteration

## Comparison with Third-Party Tool

### Similarities

- Reward APY calculation formula
- Duration-weighted lifetime average
- Multi-timeframe view (current/previous/lifetime)

### Differences

- **Not implementing Bond APY**: Requires external rebase data
- **Not implementing Net APY**: Composite of Reward + Bond
- **UI Integration**: Embedded in dashboard vs standalone tool
- **Real-time Updates**: React Query auto-refresh vs CLI/manual

This scoped approach delivers core operator value (performance visibility) while staying within existing data sources and UI patterns.

# Queue Mock Data Documentation

This document describes the rules and relationships for creating realistic mock data for deposit queue testing scenarios.

## Data Structure Overview

The mock queue system simulates Lido's CSM (Community Staking Module) deposit queue with multiple priority levels and operator batches.

## Core Data Relationships

### 1. **depositableValidatorsCount vs Batch Data**

`depositableValidatorsCount` represents the **actual** number of keys the operator can deposit, while batch data may contain **stale** information due to key removals.

**Rules:**

- `depositableValidatorsCount <= sum(operator's batches in all queues)`
- Batch data can be larger than `depositableValidatorsCount` (realistic - keys were removed but batches not updated)
- `depositableValidatorsCount` should never be larger than batch sum (impossible in real system)

**Examples:**

```javascript
// Realistic: Stale batch data (keys were removed)
operatorInfo: { depositableValidatorsCount: 15 }
operator batches total: 25 keys // ✅ Valid - 10 keys were removed

// Realistic: Accurate batch data
operatorInfo: { depositableValidatorsCount: 30 }
operator batches total: 30 keys // ✅ Valid - data is current

// Unrealistic: More depositable than batches
operatorInfo: { depositableValidatorsCount: 40 }
operator batches total: 25 keys // ❌ Invalid - impossible scenario
```

### 2. **shareLimit.queue vs Total Queue**

`shareLimit.queue` represents the **actual** total of all queued keys across all operators.

**Rules:**

- `shareLimit.queue = sum(all keys in all priority queues)`
- `shareLimit.queue >= sum(all operators' depositableValidatorsCount)`
- Batch totals may differ from `shareLimit.queue` due to coefficient calculation

### 3. **Priority System**

**Realistic Priorities (Production Use):**

- **Priority 0**: "Priority queue" - Highest priority, limited capacity per operator
- **Priority 4**: "Legacy queue" - For legacy operators
- **Priority 5**: "General queue" - Default queue for most operators

**Reserved Priorities (Future Use):**

- **Priority 1-3**: Reserved for future features, minimal test coverage

### 4. **CSM Capacity Limits**

**Rules:**

- `shareLimit.active + shareLimit.queue <= shareLimit.capacity` (under limit)
- `shareLimit.active + shareLimit.queue > shareLimit.capacity` (over limit scenario)
- `shareLimit.activeLeft = max(0, shareLimit.capacity - shareLimit.active)`

### 5. **Key Submission Logic**

When operator submits keys:

- First fill their designated priority (0, 4, or 5) up to `maxDeposits`
- Overflow goes to Priority 5 (General queue)
- Never submit to priorities 1-3 in realistic scenarios

## Test Scenario Guidelines

### Realistic Scenarios Should:

1. **Use priorities 0, 4, 5** primarily
2. **Respect stale batch data** - `depositableValidatorsCount <= batch sum`
3. **Match queue totals** - `shareLimit.queue = sum of all batch keys`
4. **Include edge cases** - zero capacity, single keys, operator at queue end
5. **Test batch merging** - adjacent operator batches should merge in visualization

### Edge Cases to Include:

1. **Stale Data Scenarios:**

   - Operator with 0 `depositableValidatorsCount` but has batches (all keys removed)
   - Large batch sum vs small `depositableValidatorsCount`

2. **Position Scenarios:**

   - Operator at beginning, middle, end of priority queues
   - Operator as only batch in a priority
   - Adjacent batches that should merge

3. **Capacity Scenarios:**

   - Zero capacity
   - Very low capacity (1-5 keys)
   - Exactly at capacity limit
   - Far over capacity limit

4. **Multi-Priority Scenarios:**

   - Keys only in Priority 0
   - Keys only in Priority 5
   - Keys split between Priority 0 and 5
   - All priorities empty except Priority 5
   - All priorities (P0-P5) active with keys
   - Operator distributed across all 6 priorities
   - All priorities active but operator has no keys

5. **All-Priority Scenarios:**

   - Comprehensive queue state with all 6 priorities populated
   - Operator presence across every priority level (P0-P5)
   - All priorities extending beyond capacity limits
   - Full queue activity without current operator participation

6. **Submission Scenarios:**
   - Submitting to empty Priority 0
   - Priority 0 at limit, overflow to Priority 5
   - Large submission that spans multiple priorities

## Data Validation Checklist

Before adding a new test scenario, verify:

- [ ] `depositableValidatorsCount <= sum(operator batches)`
- [ ] `shareLimit.queue = sum(all batch keys)`
- [ ] Uses realistic priorities (0, 4, 5)
- [ ] CSM limits are realistic
- [ ] Scenario has clear testing purpose
- [ ] Edge cases are properly documented

## Common Pitfalls

1. **Making `depositableValidatorsCount` larger than batch sum** - Impossible in real system
2. **Using priorities 1-3 in realistic scenarios** - These are reserved for future
3. **Ignoring stale batch data** - Real system often has outdated batch information
4. **Inconsistent queue totals** - `shareLimit.queue` must match actual queue sum
5. **Unrealistic capacity limits** - Should reflect real CSM constraints

## Testing Groups

Test scenarios are organized into logical groups (42 total scenarios):

- **[Basic]** (5): Empty queue, active-only, within/over limits
- **[Priority]** (5): Distribution across production priorities (P0, P4, P5)
- **[Position]** (6): Operator placements - beginning, middle, end, single key scenarios
- **[Stale]** (3): Realistic batch data inconsistencies due to key removals
- **[Edge]** (3): Capacity limits - zero, extremely low, single keys
- **[Submit]** (3): Key submission patterns and priority allocation
- **[Fallback]** (3): Undefined data, error scenarios, general queue fallback
- **[Stress]** (2): Large-scale, high-volume testing
- **[Coeff]** (1): Queue coefficient calculation edge cases
- **[Reserved]** (4): Reserved priorities (P1-P3) for future feature testing
- **[All Priorities]** (4): Comprehensive testing with all 6 priorities active
- **[Real]** (3): Realistic edge cases - P5-only, far triggers, multi-priority operators

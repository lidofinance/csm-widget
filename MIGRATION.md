# Migration Guide: Legacy Technologies to Modern Stack

This document outlines the comprehensive migration plan for transitioning from legacy Web3 technologies to modern alternatives in the Lido CSM SDK project.

## Migration Overview

**From:** `ethers.js v5` + `SWR` + `@lido-sdk/*` packages  
**To:** `viem` + `@tanstack/react-query` + `@lidofinance/lido-ethereum-sdk` + `@lidofinance/lido-csm-sdk`

**Current Status:** ~60% migrated (modules/web3/hooks are 94% complete)

## Priority Matrix

### 🔴 Priority 1: Critical Infrastructure (Must Complete First)

#### Core Web3 Provider

- **File**: `modules/web3/web3-provider/sdk-legacy.tsx`
- **Legacy**: `@ethersproject/providers` (Web3Provider), `@lido-sdk/react` (ProviderSDK)
- **Impact**: Core web3 provider setup - affects entire application
- **Effort**: 1-2 weeks (Very High Complexity)
- **Status**: 🔴 Not Started

#### Contract Interactions

- **File**: `shared/hooks/useCsmContracts.ts`
- **Legacy**: `@lido-sdk/react` (contractHooksFactory)
- **Impact**: Core CSM contract interactions
- **Effort**: 1-3 days (High Complexity)
- **Status**: 🔴 Not Started
- **Note**: Has TODO comment "remove this file after migrate to wagmi"

#### Gas Estimation

- **File**: `utils/estimate-gas.ts`
- **Legacy**: `@ethersproject/providers` (BaseProvider), `ethers` (PopulatedTransaction)
- **Impact**: All transaction operations
- **Effort**: 4-8 hours (Medium Complexity)
- **Status**: 🔴 Not Started

#### Data Fetching Strategies

- **File**: `consts/swr-strategies.ts`
- **Legacy**: `swr` (SWRConfiguration)
- **Impact**: All data fetching patterns
- **Effort**: 1-2 hours (Low Complexity)
- **Status**: 🔴 Not Started

### 🟡 Priority 2: Business Logic (Core Features)

#### Deposit Queue Management

- **File**: `shared/hooks/useCSMQueueBatches.ts`
- **Legacy**: `@lido-sdk/react` (useLidoSWR), `ethers` (BigNumber)
- **Impact**: Queue visualization and management
- **Effort**: 1-3 days (High Complexity)
- **Status**: 🔴 Not Started

#### Share Limit Management

- **File**: `shared/hooks/useCSMShareLimitInfo.ts`
- **Legacy**: `@lido-sdk/react` (useContractSWR), `ethers` (BigNumber)
- **Impact**: Stake limit validation
- **Effort**: 1-3 days (High Complexity)
- **Status**: 🔴 Not Started

#### Queue Visualization

- **File**: `features/view-keys/deposit-queue/use-deposit-queue-graph.ts`
- **Legacy**: `@ethersproject/constants` (Zero), `ethers` (BigNumber)
- **Impact**: Deposit queue graph visualization
- **Effort**: 1-3 days (High Complexity)
- **Status**: 🔴 Not Started

#### Key Availability Calculations

- **File**: `shared/hooks/use-keys-available.ts`
- **Legacy**: `@ethersproject/constants` (Zero), `ethers` (BigNumber)
- **Impact**: Key management functionality
- **Effort**: 1-3 days (High Complexity)
- **Status**: 🔴 Not Started
- **Critical Issue**: References undefined `useCurveInfo` function

### 🟢 Priority 3: Supporting Features

#### Form Validations (Multiple Files)

- **Files**:
  - `features/claim-bond/claim-bond-form/context/use-claim-bond-validation.ts`
  - `features/unlock-bond/unlock-bond-form/context/use-unlock-bond-validation.ts`
  - `features/stealing/stealing-cancel-form/context/use-stealing-cancel-validation.ts`
- **Legacy**: `@ethersproject/units` (formatEther)
- **Impact**: Form validation across features
- **Effort**: 4-8 hours each (Medium Complexity)
- **Status**: 🔴 Not Started

#### Data Merging Utility

- **File**: `shared/hooks/useMergeSwr.ts`
- **Legacy**: `@lido-sdk/react` (SWRResponse)
- **Impact**: Used to combine multiple data sources
- **Effort**: 4-8 hours (Medium Complexity)
- **Status**: 🔴 Not Started

#### Node Operator Information

- **File**: `shared/hooks/useNodeOperatorInfo.ts`
- **Legacy**: `@lido-sdk/react` (useContractSWR), `@ethersproject/constants` (AddressZero)
- **Impact**: Operator data management
- **Effort**: 4-8 hours (Medium Complexity)
- **Status**: 🔴 Not Started

### 🔵 Priority 4: Utilities and UI Components

#### Address Input Component

- **File**: `shared/components/input-address/input-address.tsx`
- **Legacy**: `@lido-sdk/react` (useSDK), `ethers/lib/utils` (isAddress)
- **Impact**: Address validation in forms
- **Effort**: 4-8 hours (Medium Complexity)
- **Status**: 🔴 Not Started

#### Etherscan Link Components (5 files)

- **Files**: Various FAQ and link components
- **Legacy**: `@lido-sdk/helpers` (getEtherscanAddressLink, getEtherscanTxLink)
- **Impact**: External links to Etherscan
- **Effort**: 1-2 hours each (Low Complexity)
- **Status**: 🔴 Not Started

#### Surveys Feature

- **File**: `features/surveys/shared/use-surveys-swr.ts`
- **Legacy**: `swr` (useSWR)
- **Impact**: Surveys functionality
- **Effort**: 4-8 hours (Medium Complexity)
- **Status**: 🔴 Not Started

## Critical Issues to Address

### 1. Missing useCurveInfo Function

- **Location**: `shared/hooks/use-keys-available.ts:31`
- **Issue**: References undefined `useCurveInfo(curveId)` function
- **Impact**: Build error, blocks migration
- **Action**: Define function or fix import before migration

### 2. Complex RPC Provider

- **Location**: `utils/get-static-rpc-batch-provider.ts`
- **Issue**: Custom ethers provider class with complex batching logic
- **Impact**: High complexity migration
- **Action**: Consider if equivalent viem patterns exist

### 3. TypeChain Configuration

- **Location**: `typechain.json`
- **Issue**: Still configured for ethers-v5
- **Impact**: Generated contract types incompatible with viem
- **Action**: Update to use viem target after migration

## Migration Strategy

### Phase 1: Foundation (Week 1-2)

1. Fix critical issues (missing `useCurveInfo`)
2. Migrate data fetching strategies (`consts/swr-strategies.ts`)
3. Update utility functions (`utils/format-hex.ts`)
4. Migrate Etherscan link components

### Phase 2: Core Infrastructure (Week 3-4)

1. Migrate contract hooks (`shared/hooks/useCsmContracts.ts`)
2. Update gas estimation (`utils/estimate-gas.ts`)
3. Migrate core web3 provider (`modules/web3/web3-provider/sdk-legacy.tsx`)

### Phase 3: Business Logic (Week 5-7)

1. Migrate queue management hooks
2. Update share limit calculations
3. Migrate key availability calculations
4. Update deposit queue visualization

### Phase 4: Feature Integration (Week 8-9)

1. Migrate form validation hooks
2. Update address input components
3. Migrate surveys feature
4. Update node operator information hooks

### Phase 5: Cleanup and Testing (Week 10)

1. Remove legacy dependencies from package.json
2. Update TypeChain configuration
3. Regenerate contract types
4. Comprehensive testing

## Dependencies to Remove After Migration

```json
{
  "ethers": "^5.7.2",
  "@ethersproject/bignumber": "^5.7.0",
  "@ethersproject/bytes": "^5.7.0",
  "@ethersproject/constants": "^5.7.0",
  "@ethersproject/contracts": "^5.7.0",
  "@ethersproject/providers": "^5.7.0",
  "@ethersproject/units": "^5.7.0",
  "@lido-sdk/constants": "^3.6.0",
  "@lido-sdk/contracts": "^3.6.0",
  "@lido-sdk/fetch": "^3.6.0",
  "@lido-sdk/helpers": "^3.6.0",
  "@lido-sdk/providers": "^3.6.0",
  "@lido-sdk/react": "^3.6.0",
  "swr": "^2.2.5"
}
```

## Success Metrics

- [ ] All legacy imports removed
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Bundle size reduced
- [ ] Performance improvements measured
- [ ] Legacy dependencies removed from package.json

## Key Migration Patterns

### BigNumber → BigInt

```typescript
// Before
import { BigNumber } from 'ethers';
const amount = BigNumber.from('1000000000000000000');

// After
const amount = BigInt('1000000000000000000');
```

### SWR → React Query

```typescript
// Before
import useSWR from 'swr';
const { data, error } = useSWR(key, fetcher);

// After
import { useQuery } from '@tanstack/react-query';
const { data, error } = useQuery({ queryKey: [key], queryFn: fetcher });
```

### @lido-sdk/react → New SDKs

```typescript
// Before
import { useContractSWR } from '@lido-sdk/react';

// After
import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
// Use new SDK methods with react-query
```

## Timeline Estimate

**Total Duration**: 10 weeks  
**Estimated Effort**: 200-300 hours  
**Recommended Team Size**: 2-3 developers

## Notes

- The `modules/web3/hooks/` directory is already 94% migrated
- Many files contain TODO comments referencing the migration
- Modern dependencies are already installed
- Some features are already using the new stack

This migration represents a significant modernization effort that will improve performance, reduce bundle size, and align with current best practices in the Ethereum development ecosystem.

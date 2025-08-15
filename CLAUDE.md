# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `yarn dev` - Starts Next.js development server on <http://localhost:3000>
- **Build**: `yarn build` - Builds production bundle
- **Production server**: `yarn start` - Starts production server (requires build first)
- **Lint**: `yarn lint` - Runs ESLint on TypeScript files
- **Lint fix**: `yarn lint:fix` - Runs ESLint with auto-fix
- **Type check**: `yarn types` - Runs TypeScript compiler type checking
- **Tests**: `yarn test` - Runs Playwright e2e tests (same as `yarn test:e2e`)
- **Unit tests**: `yarn test:unit` - Runs Jest unit tests

## Environment Setup

The project requires an `.env.local` file with environment variables. Copy from `.env.example` and configure:

- RPC provider URLs and CL API URLs with keys
- For testing, also set `STAND_TYPE`, `WALLET_SECRET_PHRASE`, `WALLET_PASSWORD`, `RPC_URL_TOKEN`

Install Playwright browser for tests: `yarn playwright install chromium --with-deps`

## Architecture Overview

This is a Next.js React application for Lido's Community Staking Module (CSM) widget, built on the Lido Frontend Template.

### Key Technologies

- **Next.js 12** with Pages Router (not App Router)
- **React 18** with TypeScript
- **Styled Components** for styling
- **Wagmi v2** + **Reef-Knot** for Web3 wallet connections
- **Lido SDKs** (`@lidofinance/lido-csm-sdk`, `@lidofinance/lido-ethereum-sdk`)
- **React Query** for data fetching
- **React Hook Form** for form management
- **viem** for blockchain interactions

### Project Structure

#### Core Directories

- **`features/`** - Main feature modules (dashboard, add-bond, add-keys, etc.)
- **`shared/`** - Reusable components, hooks, utilities
- **`modules/web3/`** - Web3 provider setup and blockchain hooks
- **`config/`** - Configuration management with feature flags
- **`consts/`** - Application constants and mappings
- **`pages/`** - Next.js pages and API routes

#### Key Architecture Patterns

**Feature-Based Structure**: Each feature in `features/` contains its page component, form logic, and feature-specific components.

**Web3 Integration**:

- `modules/web3/web3-provider/` - Wagmi + Reef-Knot wallet provider setup
- `modules/web3/hooks/` - Custom hooks for blockchain data (balances, operator info, etc.)
- `modules/web3/operator-provider/` - Node operator context and state management

**Configuration System**:

- Runtime configuration with server/public configs in `next.config.mjs`
- Feature flags in `config/feature-flags/`
- User configuration in `config/user-config/`

**Shared Components**:

- `shared/components/` - Reusable UI components
- `shared/hook-form/` - Form controls and validation utilities
- `shared/layout/` - Navigation, header, footer components

### Development Notes

- Uses **publicRuntimeConfig** for environment variables to support Docker deployment
- Includes bundle analysis with `ANALYZE_BUNDLE=true yarn build`
- Has automatic versioning using conventional commits
- Uses Playwright for e2e testing with wallet extensions

## Code Formatting

**IMPORTANT**: Always follow the project's formatting rules when creating or editing files:

- Respect `.editorconfig` settings for indentation, line endings, and file encoding
- Follow `.prettierrc` configuration for code formatting and style
- Run `yarn lint:fix` after making changes to ensure consistent formatting
- Always use `type` declarations instead of `interface` declarations for TypeScript type definitions

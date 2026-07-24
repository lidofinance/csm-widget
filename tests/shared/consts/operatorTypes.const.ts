// Re-export the app metadata so test copy can never drift from UI copy.
// Import the file directly (not the 'consts' barrel) to keep config/env
// dependent modules out of the Playwright runtime.
export { OPERATOR_TYPE_METADATA } from 'consts/operator-type-metadata';

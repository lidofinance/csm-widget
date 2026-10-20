// Relative import: absolute 'config' here causes a cyclic import.
import { config } from './get-config';

// Runtime flag (off only on prod), so mainnet staging keeps QA tools
export const qaToolsEnabled = config.isTestEnv;

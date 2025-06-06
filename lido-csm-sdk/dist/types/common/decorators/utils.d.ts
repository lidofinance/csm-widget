import { LOG_MODE } from '@lidofinance/lido-ethereum-sdk';
import { HeadMessage } from './types.js';
type CoreLog = {
    logMode: LOG_MODE;
};
export declare const callConsoleMessage: <This>(this: This, headMessage: HeadMessage, message: string, cssHeadMessage?: HeadMessage) => void;
export declare const isCore: (value: unknown) => value is CoreLog;
export declare const hasCore: (value: unknown) => value is {
    core: CoreLog;
};
export {};
//# sourceMappingURL=utils.d.ts.map
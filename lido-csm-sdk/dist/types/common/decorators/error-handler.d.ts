import { type HeadMessage } from './types.js';
export declare const ErrorHandler: (headMessage?: HeadMessage) => <This, Args extends any[], Return>(originalMethod: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>) => (this: This, ...args: Args) => Return;
//# sourceMappingURL=error-handler.d.ts.map
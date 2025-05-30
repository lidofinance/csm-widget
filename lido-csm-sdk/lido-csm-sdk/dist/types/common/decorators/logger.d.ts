import { type HeadMessage } from './types.js';
export declare const Logger: (
  headMessage?: HeadMessage,
) => <This, Args extends any[], Return>(
  originalMethod: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
) => (this: This, ...args: Args) => Return;
//# sourceMappingURL=logger.d.ts.map

import { z } from 'zod';

// Prevent Zod v4 JIT compilation that violates CSP script-src.
// Must be imported before any module that creates Zod schemas.
z.config({ jitless: true });

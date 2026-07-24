import { defineConfig } from '@hey-api/openapi-ts';

// Generates the CSM Survey API SDK from the vendored OpenAPI spec:
//   - types.gen.ts   (@hey-api/typescript)   — DTOs + per-operation Data/Response
//   - sdk.gen.ts     (@hey-api/sdk)          — typed per-operation functions
//   - client.gen.ts  (@hey-api/client-fetch) — bundled fetch client runtime
// The client runtime is bundled into the output (no extra npm dependency).
// We do NOT wire the generated `client` to a base URL or auth here — the single
// configured instance lives in `api/survey-client.ts` and is passed per call.
// No react-query plugin yet — that lands with the hook rewire (T5).
// Regenerate with `yarn survey:codegen`; refresh the spec with
// `yarn survey:openapi:pull`.
export default defineConfig({
  input: './modules/surveys-sdk/openapi/survey-api.json',
  output: {
    path: 'modules/surveys-sdk/generated',
    // Prepend an eslint-disable banner so the committed generated files pass
    // lint-staged (which runs eslint with `--ignore-path .gitignore`, ignoring
    // .eslintignore). `ctx.defaultValue` keeps the "auto-generated" notice.
    header: (ctx) => ['/* eslint-disable */', ...ctx.defaultValue],
    // Format the output with the project's Prettier config.
    postProcess: ['prettier'],
  },
  plugins: [
    '@hey-api/typescript',
    // Bundled fetch client runtime → client.gen.ts. We do NOT enable
    // `throwOnError` globally; survey-client.ts opts in per request so the
    // error interceptor can map non-2xx into a SurveysApiError.
    '@hey-api/client-fetch',
    // Typed per-operation functions → sdk.gen.ts. `client: false` means the
    // functions do NOT bind to the generated module-level client; the caller
    // must pass `{ client }` (our configured instance) on every call.
    {
      name: '@hey-api/sdk',
      client: false,
    },
  ],
});

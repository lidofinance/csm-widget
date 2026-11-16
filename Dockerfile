ARG ALPINE_VERSION=3.24
FROM node:24-alpine${ALPINE_VERSION} AS node-base

# dependencies for the build
FROM node-base AS deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts && yarn cache clean

# runtime-only dependencies, kept apart so the final image never sees devDependencies
FROM node-base AS prod-deps

WORKDIR /app

COPY package.json yarn.lock ./
# optional deps are native build tooling (swc, lightningcss) or unused at runtime (sharp: images.unoptimized)
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts --production --ignore-optional && yarn cache clean

# build env
FROM deps AS build

COPY . .

# Runtime build metadata (surfaced in the footer + /api metrics). The reusable
# Harbor workflow passes these as build-args; regenerate build-info.json from
# them so the bundled values reflect the actual build. Local builds without
# these args keep the tracked REPLACE_WITH_* placeholders untouched.
ARG BUILD_VERSION
ARG BUILD_BRANCH
ARG BUILD_COMMIT
# baked into the build; the runner must boot with the same BASE_PATH
ARG BASE_PATH=""
# .next/cache is a multi-hundred-MB webpack FS cache; it must not leak into COPY --from=build below
RUN if [ -n "$BUILD_COMMIT" ]; then \
      printf '{"version":"%s","branch":"%s","commit":"%s"}\n' \
        "$BUILD_VERSION" "$BUILD_BRANCH" "$BUILD_COMMIT" > build-info.json; \
    fi \
    && yarn build \
    && rm -rf .next/cache

# runtime image
FROM node-base AS runner

# runtime is plain node; bundled npm/yarn/corepack deps are frequent scanner findings
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
      /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
      /opt/yarn-v* /usr/local/bin/yarn /usr/local/bin/yarnpkg

ARG BASE_PATH=""
ARG DEFAULT_CHAIN="1"

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  BASE_PATH=$BASE_PATH \
  DEFAULT_CHAIN=$DEFAULT_CHAIN

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json /app/next.config.mjs /app/next-logger.config.cjs /app/build-info.json /app/server.mjs ./
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/config/client-env.mjs ./config/client-env.mjs
COPY --from=build /app/config/csp/policy.mjs ./config/csp/policy.mjs

# ARG does not cross stages; re-declared here so the labels resolve
ARG BUILD_VERSION
ARG BUILD_COMMIT
LABEL org.opencontainers.image.source="https://github.com/lidofinance/csm-widget" \
      org.opencontainers.image.version="$BUILD_VERSION" \
      org.opencontainers.image.revision="$BUILD_COMMIT"

USER node
EXPOSE 3000

# start-period covers app.prepare(); k8s ignores this and uses its own probes
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
  CMD wget -q -O /dev/null "http://localhost:${PORT:-3000}${BASE_PATH}/api/health" || exit 1

# node must be PID 1 to receive SIGTERM and exit truthfully; yarn and `node --run`
# both forward the signal but exit non-zero. Mirrors the `start` script — keep in sync.
CMD ["node", "-r", "next-logger", "--no-warnings=ExperimentalWarning", "server.mjs"]

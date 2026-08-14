# dependencies for the build
FROM node:24-alpine AS deps

WORKDIR /app

RUN apk add --no-cache git=~2
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts && yarn cache clean

# runtime-only dependencies, kept apart so the final image never sees devDependencies
FROM node:24-alpine AS prod-deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts --production && yarn cache clean

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
RUN if [ -n "$BUILD_COMMIT" ]; then \
      printf '{"version":"%s","branch":"%s","commit":"%s"}\n' \
        "$BUILD_VERSION" "$BUILD_BRANCH" "$BUILD_COMMIT" > build-info.json; \
    fi

RUN NODE_NO_BUILD_DYNAMICS=true yarn build

# final image
FROM node:24-alpine AS base

ARG BASE_PATH=""
ARG DEFAULT_CHAIN="1"

ENV NEXT_TELEMETRY_DISABLED=1 \
  BASE_PATH=$BASE_PATH \
  DEFAULT_CHAIN=$DEFAULT_CHAIN

WORKDIR /app
RUN apk add --no-cache curl=~8

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
# next.config.mjs is re-evaluated on server start: it regenerates public/runtime,
# manifest.json and the favicons from MODULE, so user node must own public/
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build /app/package.json /app/next.config.mjs /app/next-logger.config.cjs /app/env-dynamics.mjs /app/build-info.json ./
COPY --from=build /app/scripts ./scripts

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["yarn", "start"]

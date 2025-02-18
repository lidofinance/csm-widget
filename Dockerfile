# build env
FROM node:20-alpine as build

WORKDIR /app

RUN apk add --no-cache git=~2
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts && yarn cache clean
COPY . .
RUN NODE_NO_BUILD_DYNAMICS=true NODE_ENV=production yarn typechain && yarn build
# public/runtime is used to inject runtime vars; it should exist and user node should have write access there for it
RUN rm -rf /app/public/runtime && mkdir /app/public/runtime && chown node /app/public/runtime

# final image
FROM node:20-alpine as base

ARG BASE_PATH=""
# SUPPORTED_CHAINS and DEFAULT_CHAIN will be set in dappnode Lido CSM generic repository
#ARG DEFAULT_CHAIN="1"

ENV NEXT_TELEMETRY_DISABLED=1 \
  BASE_PATH=$BASE_PATH \
  PORT=80 \
  NODE_ENV=production 
#SUPPORTED_CHAINS=$SUPPORTED_CHAINS \
#DEFAULT_CHAIN=$DEFAULT_CHAIN

WORKDIR /app
RUN apk add --no-cache curl=~8
COPY --from=build /app /app

USER node
#EXPOSE 3000
# DAPPNODE
EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost/api/health || exit 1
#CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["yarn", "start"]

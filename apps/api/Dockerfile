FROM docker.io/node:lts-alpine as dependencies
ENV CI=true
ENV PORT 8000
ENV PNPM_HOME="/pnpm"
ENV NODE_ENV=production
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM dependencies  as install
WORKDIR /usr/src/app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

FROM dependencies as build
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY . .
COPY --from=install /usr/src/app/node_modules node_modules
RUN pnpm nx build api --configuration=production

FROM dependencies as runner
RUN apk add --no-cache dumb-init
WORKDIR /usr/src/app
COPY --from=install /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/dist/apps/api .
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --prod

RUN chown -R node:node .
USER node
EXPOSE 8000

# If you are using the custom server implementation:
CMD ["dumb-init", "node", "main.js"]

FROM docker.io/node:lts-alpine as dependencies
ENV PNPM_HOME="/pnpm"
ENV NODE_ENV=production
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY . .
RUN pnpm install --prod --frozen-lockfile
RUN pnpm deploy --legacy --prod ./prod/ --filter=@nrwlz/api

# # Production image, copy all the files and run next
FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init
ENV NODE_ENV production
ENV PORT 8000
WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules node_modules
COPY --from=dependencies /usr/src/app/prod/dist .

RUN ls -a 
RUN sleep 10

RUN chown -R node:node .
USER node
EXPOSE 8000

# If you are using the custom server implementation:
CMD ["dumb-init", "node", "main.js"]

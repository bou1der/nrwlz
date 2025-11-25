FROM docker.io/node:lts-alpine AS dependencies
ENV CI=true
ENV PORT 8000
ENV PNPM_HOME="/pnpm"
ENV NODE_ENV=production
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM dependencies AS install
WORKDIR /usr/src/app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
WORKDIR /usr/src/app
COPY . .
COPY --from=install /usr/src/app/node_modules node_modules
RUN pnpm nx build web --configuration=production --no-cloud

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/apps/web .
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s|API_URL|$API_URL|g" /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

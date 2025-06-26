FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && echo "Asia/Bangkok" > /etc/timezone

# Set timezone environment variable
ENV TZ=Asia/Bangkok

COPY package.json package-lock.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
COPY .env .env.development

RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && echo "Asia/Bangkok" > /etc/timezone

# Set timezone environment variable
ENV TZ=Asia/Bangkok

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static


EXPOSE 3000

CMD ["node", "server.js"]

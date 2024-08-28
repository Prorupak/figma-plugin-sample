# Base Image
FROM node:20-slim AS base

# Set environment variables
ARG PROJECT_DIR="/app"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install global dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && npm i -g pm2

WORKDIR $PROJECT_DIR

# Copy and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
CMD [ "cd", "server" ]
RUN pnpm install --frozen-lockfile --prod



# Build Stage
FROM base AS build
WORKDIR $PROJECT_DIR

# Copy all files
COPY . .

# Build both server
RUN pnpm build-server

# Production Stage
FROM node:20-slim AS production
WORKDIR /app

# Copy built files and necessary packages
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/node_modules ./server/node_modules

EXPOSE 6000

# Start the server in production mode
CMD ["pnpm", "start-server-prod"]

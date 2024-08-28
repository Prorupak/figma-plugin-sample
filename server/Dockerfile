# Base Image
FROM node:20-slim AS base

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install global dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && npm i -g pm2

WORKDIR /app

# Copy and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build Stage
FROM base AS build
WORKDIR /app

# Copy all files
COPY . .

# Build the server
RUN pnpm build

# Production Stage
FROM node:20-slim AS production
WORKDIR /app

# Install pnpm again to ensure it's available in the production stage
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built files and necessary packages
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 6000

# Start the server in production mode
CMD ["pnpm", "start-server-prod"]

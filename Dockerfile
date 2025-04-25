FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install necessary tools and dependencies for development
RUN apk add --no-cache \
    bash \
    git \
    g++ \
    make \
    python3 \
    tzdata \
    curl

# Create necessary directories
RUN mkdir -p /app/data/db /app/data/media/photos /app/data/media/videos /app/data/media/uploads

# Copy package.json files
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/
COPY src/backend/package*.json ./src/backend/

# Install all dependencies
RUN npm ci && \
    cd src/frontend && npm ci && \
    cd ../backend && npm ci

# Copy the rest of the code
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

# Expose ports
EXPOSE 3000 8080

# Command to start development servers
CMD ["npm", "run", "dev"]
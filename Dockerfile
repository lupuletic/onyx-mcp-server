# Build stage
FROM node:lts-alpine AS build

# Create app directory
WORKDIR /app

# Copy package files and tsconfig
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy source code
COPY src ./src

# Build the project
RUN npm run build

# Production stage
FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production --ignore-scripts

# Copy built application from build stage
COPY --from=build /app/build ./build

# Create directories for logs and tmp
RUN mkdir -p /app/logs /app/tmp

# Expose port for HTTP server
EXPOSE 3000

# Start the MCP server
CMD ["node", "build/index.js"]

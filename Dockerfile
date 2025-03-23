# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Copy package files and tsconfig
COPY package*.json ./
COPY tsconfig.json ./

# Copy source code
COPY src ./src

# Install dependencies (including dev dependencies) without running scripts
RUN npm install --ignore-scripts

# Build the project
RUN npm run build

# Optionally expose a port; MCP usually uses stdio, but exposing a port for health checks if needed
EXPOSE 3000

# Start the MCP server
CMD [ "node", "build/index.js" ]

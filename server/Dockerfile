# Stage 0: Setup Environment Variables
ARG NODE_VERSION=25-alpine

# Stage 1: Production
FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
USER node
CMD ["npm", "run", "prod"]
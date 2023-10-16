# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.9.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./

# Copy application code
COPY --link . .
RUN npm install


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app
# need python in final image
RUN apt-get update -qq && \
    apt-get install -y python3 python3-pip && \
    pip3 install one-piece-wanted-poster && \
    pip3 install requests

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]

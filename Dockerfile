FROM node:16-bullseye-slim

WORKDIR /usr/src/app

# Install runtime dependency
RUN apt-get update \
  && apt-get install -y --no-install-recommends imagemagick \
  && rm -rf /var/lib/apt/lists/*

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend code (everything except ignored files)
COPY . .

# Ensure Browserify-built assets are included
COPY public ./public

ENV NODE_ENV=production

EXPOSE 3666

CMD ["npm", "start"]

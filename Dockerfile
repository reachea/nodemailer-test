FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.js ./

USER node

# Usage: docker run --rm <image> <to> [name] [when] [where]
ENTRYPOINT ["node", "index.js"]

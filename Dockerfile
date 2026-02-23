FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js db.js ./
COPY --from=build /app/dist ./dist
RUN mkdir -p /app/data
VOLUME /app/data
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "server.js"]

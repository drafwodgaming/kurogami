FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --chown=node:node . .
USER node
CMD ["npm", "run", "prod"]
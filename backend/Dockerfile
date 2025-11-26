FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src/ ./src/
COPY src/index.js ./   
EXPOSE 3000
CMD ["node", "index.js"]
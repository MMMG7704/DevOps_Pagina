FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
ENV DB_USER=postgres
ENV DB_NAME=proyecto
ENV DB_PORT=5432
COPY src/index.js ./   
EXPOSE 3000
CMD ["node", "index.js"]

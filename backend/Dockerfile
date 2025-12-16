FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production 
COPY . .
ENV PORT=3000
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV DB_USER=postgres
ENV DB_NAME=proyecto
ENV DB_PORT=5432
EXPOSE 3000
CMD ["node", "index.js"]
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod -R 644 /app/src/*
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
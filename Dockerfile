FROM node:20-alpine
LABEL authors="Boris"

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
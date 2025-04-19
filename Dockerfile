FROM node:18-alpine
WORKDIR /src
COPY package*.json ./
COPY prisma ./prisma/
COPY . .
RUN npm install
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

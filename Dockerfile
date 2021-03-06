FROM node:10 AS build
WORKDIR /srv
COPY package*.json ./
RUN npm install --only=production

FROM node:10-slim
COPY --from=build /srv .
ADD . .
EXPOSE 5000

CMD [ "npm", "run", "start" ]
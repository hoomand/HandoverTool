FROM node:10 AS build
WORKDIR /srv
ADD package.json .
RUN npm install --only=production

FROM node:10-slim
COPY --from=build /srv .
ADD . .
EXPOSE 3000
CMD [ "npm", "start" ]
FROM  node:16-buster-slim 


WORKDIR /app

COPY ./package*.json ./
COPY ./patches ./patches
COPY ./startup.sh ./startup.sh
ENV PATH /app/node_modules/.bin:$PATH

RUN rm -rf dist/ .cache/

RUN npm install 

COPY --chown=node:node . .
RUN npm install --save amqplib
RUN npm run build

WORKDIR /app/src/plugins/services
RUN rm -rf dist/
COPY ./src/plugins/services/package*.json ./

RUN npm install 
RUN npm run build

WORKDIR /app
EXPOSE 1337

USER node

CMD ["./startup.sh"]

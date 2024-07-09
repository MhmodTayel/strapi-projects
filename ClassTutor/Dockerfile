FROM node:20-buster-slim 

# Install necessary build dependencies
RUN apt-get update \
    && apt-get install -y \
        python3 \
        python3-dev \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app/

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .
RUN chown -R node:node /opt/app/
USER node

RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "develop"]

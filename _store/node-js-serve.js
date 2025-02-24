export const NODEJS_DOCKERFILE = ({ NODEJS_VERSION, YARN_VERSION, PORT }) => `
FROM node:${NODEJS_VERSION}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g yarn@${YARN_VERSION}

RUN yarn

COPY . .

EXPOSE ${PORT}

# Run the Express server
CMD ["yarn", "dev"]
`;
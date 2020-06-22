FROM node:lts

COPY . .
RUN npm install

CMD ["npm", "start"]

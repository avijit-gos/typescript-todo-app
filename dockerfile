FROM node:latest

WORKDIR /app

# COPY package.json and package-lock.json file
COPY package*.json ./

# RUN npm install TO INSTALL ALL REQUIRED MODULE
RUN npm install

# COPY ALL CODE
COPY . .

# EXPOSE A PORT THE APP RUNS ON
EXPOSE 7070

# COMMAND TO START THE PROJECT
CMD [ "npm", "run", "dev" ]
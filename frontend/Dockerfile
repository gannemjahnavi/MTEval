# # Dockerfile for React client

# # Build react client
# FROM node:10.16-alpine

# # Working directory be app
# WORKDIR /frontend/src/

# COPY package*.json ./

# ###  Installing dependencies

# RUN npm install --silent

# # copy local files to app folder
# COPY . .

# EXPOSE 5002

# CMD ["npm","start"]
# Layer 1: Telling Docker to use the node:17-alpine image as the base image for the container.
FROM node:20.13.1

# Layer 2: Telling Docker to create a directory called `app` in the container and set it as the working directory.
WORKDIR /app

# Layer 3: Copying the package.json file from the root of the project to the `app` directory in the container.
COPY package.json /app
COPY package-lock.json /app
# Layer 4: Installing the dependencies listed in the package.json file.
RUN npm install --silent

# Layer 5: Copying all the files from the root of the project to the `app` directory in the container.
COPY . /app
# Layer 6: Telling Docker that the container will listen on port 3000.
EXPOSE 5002

# Layer 7: Telling Docker to run the `npm start` command when the container is started.
CMD ["npm", "start"]

# Use an official Node.js runtime as the base image
FROM node:20-bullseye-slim

# Install FFmpeg (Crucial for discord-player audio streaming)
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your bot's code into the container
COPY . .

# Command to start the bot
CMD ["node", "index.js"]
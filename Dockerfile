# Use a lightweight Node Alpine image to drastically cut down download and build times
FROM node:20-alpine

# Install FFmpeg using Alpine's fast package manager
RUN apk add --no-cache ffmpeg

# Set the working directory
WORKDIR /usr/src/app

# Copy ONLY the package configuration first
COPY package.json ./

# Install dependencies (Docker will cache this layer unless package.json changes)
RUN npm install --omit=dev

# Copy the rest of your application code (Fast step)
COPY . .

# Run Chad
CMD ["node", "index.js"]
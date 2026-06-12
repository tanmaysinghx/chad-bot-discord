# Use a lightweight Node Alpine image for fast builds
FROM node:20-alpine

# Install FFmpeg and system build dependencies needed for Linux audio compilation
RUN apk add --no-cache ffmpeg build-base python3

# Set the working directory
WORKDIR /usr/src/app

# Copy ONLY the package configuration first to maximize Docker caching
COPY package.json ./

# Install dependencies directly within the Linux environment
RUN npm install --omit=dev

# Copy the rest of your application code
COPY . .

# Run Chad
CMD ["node", "index.js"]
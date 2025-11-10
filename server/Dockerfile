# Use an official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies first
COPY package*.json ./
RUN npm install --production

# Copy the rest of the project files
COPY . .

# Expose your backend port
EXPOSE 8000

# Command to start the app
CMD ["npm", "run", "start"]

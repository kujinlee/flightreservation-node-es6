# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the SSL/TLS certificates
COPY certs ./certs

# Expose port 8080 for the application
EXPOSE 8080

# Start the application
CMD ["node", "src/app.js"]
# Use the official Node.js image from the Docker Hub
FROM node:16

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Run the web service on container startup.
CMD [ "node", "index.js" ]

# Stage 1: Build the app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./
RUN npm install 


COPY . .
EXPOSE 3000
CMD ["npm","run","build"]
# Stage 1: Build the app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./
RUN npm install 


COPY . .
## Build the app
RUN npm run build

# Step 2: Serve app with nginx server tes
FROM nginx:1.25.0 AS RUNNER
COPY --from=build /app/build /usr/share/nginx/html
# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
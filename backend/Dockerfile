FROM openjdk:21-slim

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Setup project directory
WORKDIR /app

# Copy project files
COPY pom.xml /app
COPY src /app/src
COPY .platform /app/.platform
COPY target /app/target

# Download dependencies and package app
RUN mvn clean package -DskipTests

# Expose Spring Boot default ports
EXPOSE 5000

# Stage 1: Build Frontend
FROM node:18 AS frontend-builder
WORKDIR /frontend
COPY ../frontend/package*.json ./
RUN npm install
COPY ../frontend ./
RUN npm run build

# Stage 2: Build Backend
FROM openjdk:21-slim AS build

RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY pom.xml ./
COPY src ./src
COPY .platform ./platform

# Copy frontend build into Spring Boot static resources
#COPY --from=frontend-builder /frontend/build ./src/main/resources/static

RUN mvn clean package -DskipTests

# Stage 3: Run
FROM openjdk:21-slim

WORKDIR /app

COPY --from=build /app/target/Pdf-Merger-0.0.1-SNAPSHOT.jar /Pdf-Merger-0.0.1-SNAPSHOT.jar
COPY .platform /app/.platform

EXPOSE 5000

ENTRYPOINT ["java", "-Dserver.port=5000", "-jar", "/Pdf-Merger-0.0.1-SNAPSHOT.jar"]

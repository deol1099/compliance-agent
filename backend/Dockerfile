<<<<<<< HEAD
FROM eclipse-temurin:21-jdk-jammy

# Copy JAR file from build context
ARG JAR_FILE=target/Pdf-Merger-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# Expose the port Elastic Beanstalk expects
EXPOSE 5000

# Run the Spring Boot application
ENTRYPOINT ["java", "-Dserver.port=5000", "-jar", "/app.jar"]
=======
# Stage 1: Build
FROM openjdk:21-slim AS build

RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pom.xml /app
COPY src /app/src
COPY .platform /app/.platform

RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:21-slim

WORKDIR /app

COPY --from=build /app/target/Pdf-Merger-0.0.1-SNAPSHOT.jar /Pdf-Merger-0.0.1-SNAPSHOT.jar
COPY .platform /app/.platform

EXPOSE 5000

ENTRYPOINT ["java", "-Dserver.port=5000", "-jar", "/Pdf-Merger-0.0.1-SNAPSHOT.jar"]
>>>>>>> devops

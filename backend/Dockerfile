FROM eclipse-temurin:21-jdk-jammy

# Copy JAR file from build context
ARG JAR_FILE=target/Pdf-Merger-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# Expose the port Elastic Beanstalk expects
EXPOSE 5000

# Run the Spring Boot application
ENTRYPOINT ["java", "-Dserver.port=5000", "-jar", "/app.jar"]
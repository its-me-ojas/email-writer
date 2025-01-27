# Use a lightweight base image with JDK
FROM eclipse-temurin:17-jdk-alpine
LABEL authors="crestfallen"

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file to the container
COPY email-writer.jar email-writer.jar

# Expose the port your Spring Boot application runs on
EXPOSE 8080

# Run the application (environment variables will be injected by Render)
ENTRYPOINT ["java", "-jar", "email-writer.jar"]

# --- Stage 1: The "Build" Stage ---
# Use a base image with the full JDK and Maven to build the app
FROM maven:3.9-eclipse-temurin-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the container
# (You can optimize this, but for simplicity, we'll copy all)
COPY . .

# Make the maven wrapper executable
RUN chmod +x mvnw

# Build the application and package it into a .jar file
# -DskipTests speeds up the build by not running tests
RUN ./mvnw package -DskipTests

# --- Stage 2: The "Run" Stage ---
# Use a minimal Java Runtime (JRE) image, which is smaller and more secure
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy ONLY the built .jar file from the 'builder' stage
# This wildcard (*) is fine if you only have one jar in the target/ folder
COPY --from=builder /app/target/*.jar app.jar

# Tell Docker what port the container will listen on
# Spring Boot's default is 8080
EXPOSE 8080

# The command to run when the container starts
# This runs the .jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
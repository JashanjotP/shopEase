# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# --- Database Configuration ---
# Set environment variables for the database.
# You can change these values.
# WARNING: Do not hardcode sensitive passwords in production Dockerfiles.
# It's better to pass them at runtime using 'docker run -e' or docker-compose.
ENV POSTGRES_USER=default
ENV POSTGRES_PASSWORD=Icandothis2407
ENV POSTGRES_DB=shopease

# --- Database Initialization ---
# Copy your setup.sql file into the special init directory.
# This script will run automatically when the database is first created.
COPY setup.sql /docker-entrypoint-initdb.d/
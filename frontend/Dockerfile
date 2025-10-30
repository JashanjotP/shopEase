# --- Stage 1: The "Build" Stage ---
# Use an official Node.js image to build the app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and lock file (if you have one)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the static files
RUN npm run build

# --- Stage 2: The "Run" Stage ---
# Use a minimal Nginx image to serve the files
FROM nginx:alpine

# Copy the built files from the 'builder' stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy our custom Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx's default port)
EXPOSE 80
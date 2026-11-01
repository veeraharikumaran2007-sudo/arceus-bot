FROM node:20-slim

# Install system dependencies needed for Baileys
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

# Expose server port
EXPOSE 5000

# Persist WhatsApp session directory
VOLUME ["/app/auth_info"]

# Start Arceus Bot
CMD ["node", "server.js"]

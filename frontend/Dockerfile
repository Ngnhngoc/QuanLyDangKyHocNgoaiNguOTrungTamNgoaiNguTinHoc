FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm
USER root
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Chạy trực tiếp lệnh start để hỗ trợ Hot Reload
CMD ["npm", "start"]

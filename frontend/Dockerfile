FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Chạy trực tiếp lệnh start để hỗ trợ Hot Reload
CMD ["npm", "start"]
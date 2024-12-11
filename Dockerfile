# Gunakan base image dengan Node.js di Alpine
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./
# Instal dependensi sistem yang diperlukan (libssl, libc)

# Instal dependensi Node.js
RUN npm install

# Instal Prisma sebagai dev dependency
RUN npm install prisma --save-dev

# Salin semua file aplikasi
COPY . .

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production
ENV XENDIT_ENVIRONMENT=production
ENV LOG_LEVEL=info
ENV SUCCESS_REDIRECT_URL=https://tedxunand.com/
ENV FAILURE_REDIRECT_URL=https://tedxunand.com/

RUN npx prisma generate

# Expose port 8080
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]
# ============================================
# Dockerfile multi-stage - Backend PRODUCCIÓ
# ============================================

# Stage 1: Instal·lar dependències
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Imatge final lleugera
FROM node:20-alpine
WORKDIR /app

# Copiar només les dependències de producció
COPY --from=build /app/node_modules ./node_modules

# Copiar codi font i package.json
COPY src ./src
COPY package.json ./

# Port de l'aplicació
EXPOSE 4000

# Arrancar amb node (sense nodemon)
CMD ["node", "src/index.js"]

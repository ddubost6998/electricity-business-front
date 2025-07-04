# --- Étape 1: Build de l'application Angular ---
FROM node:18.13.0-alpine AS build

# Définis le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installe les dépendances Node.js
RUN npm install

# Copie le reste des fichiers du projet
COPY . .

# Build l'application Angular pour la production
ARG ANGULAR_PROJECT_NAME=electricity-business
RUN npm run build -- --output-path=./dist/browser --configuration=production --project=${ANGULAR_PROJECT_NAME}

# Vérifie le contenu du dossier de sortie pour débogage
RUN ls -la ./dist/browser


# --- Étape 2: Service de l'application avec Nginx ---
FROM nginx:stable-alpine AS serve

# Copie la configuration Nginx personnalisée
# Nous allons créer ce fichier plus tard
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie les fichiers statiques de l'application depuis le stage de build
# Le chemin 'dist/browser' est le chemin par défaut pour Angular 17
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Expose le port par défaut de Nginx
EXPOSE 80

# Commande par défaut pour démarrer Nginx (déjà intégrée dans l'image Nginx)
CMD ["nginx", "-g", "daemon off;"]

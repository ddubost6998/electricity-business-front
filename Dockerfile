FROM node:18.13.0-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG ANGULAR_PROJECT_NAME=electricity-business
RUN npm run build -- --output-path=./dist/browser --configuration=production --project=${ANGULAR_PROJECT_NAME}

RUN ls -la ./dist/browser

FROM nginx:stable-alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

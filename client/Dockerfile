FROM node AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install react-scripts@5.0.1 -g --silent
COPY . .
RUN npm run build


FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
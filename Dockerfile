FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY conf/nginx.conf /etc/nginx/conf.d
COPY ./dist /app

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

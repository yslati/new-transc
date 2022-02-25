FROM debian:latest

RUN apt update && apt -y install nodejs npm

WORKDIR /

COPY srcs/setup.sh .
RUN chmod +x setup.sh

#RUN sed -i "s|BACKEND_URL|http://192.168.99.102:4000|" apps/frontend/services/api.ts
#RUN sed -i "s|BACKEND_URL|http://192.168.99.102:4000|" apps/frontend/components/Navbar.tsx
#RUN cd apps/backend && npm i &> /dev/null && npm run build &> /dev/null
#RUN cd apps/frontend && npm i &> /dev/null && npm run build &> /dev/null

CMD ./setup.sh

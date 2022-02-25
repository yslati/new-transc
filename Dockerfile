FROM alpine:3.14

RUN apk add nodejs npm

WORKDIR /


COPY srcs .
RUN chmod +x setup.sh

RUN sed -i "s|BACKEND_URL|http://localhost:4000|" apps/frontend/services/api.ts
RUN sed -i "s|BACKEND_URL|http://localhost:4000|" apps/frontend/components/Navbar.tsx
RUN cd apps/backend && npm i &> /dev/null && npm run build &> /dev/null
RUN cd apps/frontend && npm i &> /dev/null && npm run build &> /dev/null


CMD ./setup.sh
#!/bin/sh

#cd /apps/backend && npm run start &
#cd /apps/frontend && npm run start
sed -i "s|BACKEND_URL|http://192.168.99.102:4000|" apps/frontend/services/api.ts
sed -i "s|BACKEND_URL|http://192.168.99.102:4000|" apps/frontend/components/Navbar.tsx
while true
do
	sleep 1
done

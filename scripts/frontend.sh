#!/bin/bash
cd /home/app
RUN echo "NEXTJS_PUBLIC_IPFS_URL=${NEXTJS_PUBLIC_IPFS_URL}/" >> ./packages/frontend/.env
RUN echo "GRAPHQL_BACKEND_URL=${GRAPHQL_BACKEND_URL}" >> ./packages/frontend/.env
cd packages/frontend/
npm run build
npx next dev

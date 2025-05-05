FROM node:18.8-alpine as base

FROM base as builder

WORKDIR /home/node/app
COPY package*.json ./

ENV DATABASE_URI=mongodb+srv://yaseenaboobaker1:Y.a.2786@clusterecom.tntaydl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterEcom
ENV PAYLOAD_SECRET=alsdfj23jasdfj

COPY . .
RUN yarn install
RUN yarn build

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload/payload.config.js

WORKDIR /home/node/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production

# Copy necessary build outputs
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build
COPY --from=builder /home/node/app/.next ./.next
COPY --from=builder /home/node/app/public ./public
COPY --from=builder /home/node/app/csp.js ./csp.js
COPY --from=builder /home/node/app/redirects.js ./redirects.js
COPY --from=builder /home/node/app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["node", "dist/server.js"]

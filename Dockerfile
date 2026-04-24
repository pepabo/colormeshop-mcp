# Introspection-only image for MCP registry indexing (Glama etc). Not for runtime use.
FROM mirror.gcr.io/library/node:24-alpine

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node tools.json ./
COPY --chown=node:node bin ./bin
COPY --chown=node:node lib ./lib

RUN npm ci --omit=dev && chmod +x bin/colormeshop-mcp.js

USER node

ENTRYPOINT ["node", "bin/colormeshop-mcp.js"]

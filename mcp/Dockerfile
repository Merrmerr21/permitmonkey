# PermitMonkey MCP server — production container.
#
# Two-stage build:
#   1. deps + tsc compile in node:22-slim
#   2. runtime in node:22-slim with only dist/ + production deps
#
# Per master playbook §65 + §103: this container is the remote MCP
# server submitted to claude.ai/directory. Deploy to any container host
# (Cloud Run, Fly.io, Railway, Render). Cloud Run is the default since
# the rest of the PermitMonkey orchestrator already runs there.

FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile || npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8787
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --frozen-lockfile || npm install --omit=dev
COPY --from=build /app/dist ./dist

# Cloud Run injects PORT; default 8787 for local docker run.
EXPOSE 8787

USER node
CMD ["node", "dist/index.js"]

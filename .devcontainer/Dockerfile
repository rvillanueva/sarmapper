
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:24-bullseye

WORKDIR /workspace

RUN npm install -g pnpm

ADD package.json /workspace
ADD pnpm-lock.yaml /workspace

RUN pnpm install

RUN npx playwright install --with-deps

ADD .gitignore /workspace
ADD .git /workspace/.git

ADD . /workspace
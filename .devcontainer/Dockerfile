# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.234.0/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT="20-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

WORKDIR /workspace

ADD package.json /workspace
ADD yarn.lock /workspace

RUN yarn install

RUN npx playwright install --with-deps

ADD .gitignore /workspace
ADD .git /workspace/.git

ADD . /workspace
#version must match the version of playwright in package.json
FROM mcr.microsoft.com/playwright:v1.57.0-noble

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install --force
#install browsers
RUN npx playwright install

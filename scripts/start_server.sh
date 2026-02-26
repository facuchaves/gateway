#!/bin/bash
cd /var/www/microservice

# Traer variables de AWS
export NEW_RELIC_LICENSE_KEY=$(aws ssm get-parameter --name "/prod/microservice/NEW_RELIC_LICENSE_KEY" --with-decryption --query "Parameter.Value" --output text)
export APP_VERSION=$(aws ssm get-parameter --name "/prod/microservice/APP_VERSION" --query "Parameter.Value" --output text)

# Reiniciar o empezar
pm2 restart microservice --update-env || pm2 start dist/main.js --name microservice --node-args="-r newrelic --max-old-space-size=450"
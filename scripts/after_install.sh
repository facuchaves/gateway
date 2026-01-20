#!/bin/bash

echo after_install

cd /opt/webapp/gateway

yarn
yarn build
yarn start > /dev/null 2> /dev/null < /dev/null &
#!/bin/bash

echo before_install

# Install node.js
curl -sL https://rpm.nodesource.com/setup_12.x | sudo bash -
sudo yum -y install nodejs
npm --version
npm install --global yarn
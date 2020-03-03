#!/bin/bash

npm run tsc

./build.ts

mkdir ./dist/public
cp -a public/. dist/public
cp ./README.md dist/README.md

cd ./dist

yarn install


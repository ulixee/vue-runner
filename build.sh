#!/bin/bash

npm run tsc

./build.ts

mkdir ./dist/public
cp -a public/. dist/public

cd ./dist

yarn install


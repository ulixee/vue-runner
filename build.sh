#!/bin/bash

npm run compile

./build-package-json.ts
./build-tsconfig.ts

mkdir ./dist/public
cp -a public/. dist/public
cp ./README.md dist/README.md

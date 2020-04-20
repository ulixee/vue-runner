#!/usr/bin/env ts-node

// @ts-ignore
import * as Path from 'path';
// @ts-ignore
import * as Fs from 'fs';

// @ts-ignore
const DIST_DIR = Path.join(__dirname, 'dist');

// CUSTOMIZE AND SAVE TSCONFIG.JSON
// @ts-ignore
const tsconfigPath = Path.join(__dirname, 'tsconfig.json');
const tsconfigRaw = Fs.readFileSync(tsconfigPath, 'utf-8');
const tsconfig = require('typescript').parseConfigFileTextToJson(tsconfigPath, tsconfigRaw).config;
delete tsconfig.compilerOptions.outDir;
tsconfig.include = [
  "src/**/*.ts",
  "src/**/*.tsx",
  "src/**/*.vue",
];
const tsconfigDistPath = Path.join(DIST_DIR, 'tsconfig.json');
Fs.writeFileSync(tsconfigDistPath, JSON.stringify(tsconfig, null, 2));
console.log(`Created ./dist/tsconfig.json`);

#!/usr/bin/env ts-node

// @ts-ignore
import * as Path from 'path';
// @ts-ignore
import * as Fs from 'fs';

// @ts-ignore
const DIST_DIR = Path.join(__dirname, 'dist');

// CUSTOMIZE AND SAVE PACKAGE.JSON
// @ts-ignore
const pkg = require('./package.json');
delete pkg.devDependencies;
delete pkg.scripts;
const packageDistPath = Path.join(DIST_DIR, 'package.json');
Fs.writeFileSync(packageDistPath, JSON.stringify(pkg, null, 2));
console.log(`Created ./dist/package.json`);

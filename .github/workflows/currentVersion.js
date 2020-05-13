#!/usr/bin/env node

const path = require('path');
const dir = process.argv[2];
const package = require(path.resolve(process.cwd(), dir, 'package.json'));
process.stdout.write(package.version);

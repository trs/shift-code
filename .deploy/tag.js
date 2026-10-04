#!/usr/bin/env node

const { execSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STRATEGIES = ['major', 'minor', 'patch'];

const [pkg, strategy] = process.argv.slice(2);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function git(...args) {
  execFileSync('git', args, { stdio: 'inherit' });
}

const manifestPath = path.join(pkg ?? '', 'package.json');

if (!pkg || !fs.existsSync(manifestPath)) {
  fail('Invalid package name');
}

if (!strategy) {
  fail('Strategy is required');
}

if (!STRATEGIES.includes(strategy)) {
  fail(`Invalid strategy, must be one of: ${STRATEGIES.join(', ')}`);
}

function readManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

const { name } = readManifest();

// yarn is a .cmd shim on Windows, so it has to go through a shell
execSync(`yarn workspace ${name} version ${strategy}`, { stdio: 'inherit' });

const { version } = readManifest();

git('add', manifestPath);
git('commit', '-m', `chore: bump ${name} to ${version}`);

const tag = pkg === 'cli' ? `v${version}` : `${name}@${version}`;

console.log(`Creating tag: ${tag}`);

git('tag', '-a', tag, '-m', version);

console.log('Creating release commit');
git('add', '.');
git('commit', '-m', `chore: release ${name} ${version}`);

git('push', '--tags');
git('push');

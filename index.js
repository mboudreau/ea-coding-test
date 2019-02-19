#!/usr/bin/env node

// I wouldn't do this in production, I'd have a build system like webpack with gulp compile the file to release javascript
require('ts-node').register();
require('./cli.ts');

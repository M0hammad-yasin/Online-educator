// inspect-module.mjs
import * as helper from './src/utils/index.js';

// Print everything the module exports
console.log(helper);

// If you just want the export names:
console.log(Object.keys(helper));

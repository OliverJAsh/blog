#!/usr/bin/env node

// Copied from https://github.com/angular/angular.js/blob/master/scripts/npm/clean-shrinkwrap.js

/**
 * this script is just a temporary solution to deal with the issue of npm outputting the npm
 * shrinkwrap file in an unstable manner.
 *
 * See: https://github.com/npm/npm/issues/3581
 */

import sorted from 'sorted-object';
import fs from 'fs';
import path from 'path';

const forEach = (collection, mapFn) =>
    Object.keys(collection).forEach(key => mapFn(collection[key], key));

const cleanModule = (module) => {
    // keep `resolve` properties for git dependencies, delete otherwise
    delete module.from;
    if (!(module.resolved
          && (module.resolved.match(/^git(\+[a-z]+)?:\/\//)
              || module.resolved.match(/^https?:\/\/github.com\//)))) {
        delete module.resolved;
    }

    forEach(module.dependencies || [], (mod, name) => {
        cleanModule(mod, name);
    });
};

console.log('- reading npm-shrinkwrap.json');
const shrinkwrapPath = path.join(__dirname, 'npm-shrinkwrap.json');
const shrinkwrap = require(shrinkwrapPath);

console.log('- cleaning it');
cleanModule(shrinkwrap, shrinkwrap.name);

console.log('- saving it to', shrinkwrapPath);
fs.writeFileSync(shrinkwrapPath, JSON.stringify(sorted(shrinkwrap), null, 2) + '\n');

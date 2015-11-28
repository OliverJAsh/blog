# Blog

## Installation

```
npm install
npm run build
npm start
```

## Development workflow
```
npm run build
# OR
npm run watch
```

### Lint
```
./node_modules/.bin/eslint .
```

## TODO

* Test SW update strategy
* * Clean out or serve old JS files?
* * Store new shell in new cache, delete old caches.
* * * Use Gulp to bump version in SW from revision map?
* * * Change filename on server
* Polyfill Promise
* TypeScript?
* Don't use babel-node in PROD
* No source map in PROD

# oliverjash.me

## Usage

```
npm install
npm run build
npm run compile
npm start
```

### Lint
```
npm run lint
```

## TODO

* No source map in PROD
* Improve deploy step
* Back broken on phone
* SEO
* Re-use request when opting to cache post

### Deploy

```
ssh -i blog.pem ec2-user@52.21.34.140
```

```
cd blog &&
git pull &&
sudo killall node &&
# TODO: Clean only works after first build
npm run clean &&
npm run build &&
npm run compile &&
sudo NODE_ENV=production npm start
```

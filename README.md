# oliverjash.me

## Usage

```
npm install
npm start
```

## Deploy

```
ssh ec2-user@52.21.34.140
```

```
cd oliverjash.me &&
git pull &&
if [ -f pgid ]; then kill -TERM -`cat pgid` && rm -rf pgid; fi &&
{ PORT=8080 npm start & } &&
echo $! > pgid &&
cat pgid
```

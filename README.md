# oliverjash.me

## Usage

```
npm install
npm start
```

## Deploy

```
ssh -i ec2.pem ec2-user@52.21.34.140
```

```
cd oliverjash.me &&
git pull &&
killall node &&
PORT=8080 npm start &
```

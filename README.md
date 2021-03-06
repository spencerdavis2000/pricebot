# Price bot for Uphold / @spencerdavis/pricebot

This repo is invoked via cron through aws lambda

#### To run locally, clone repo to local computer or Desktop

> Install nodejs version LTS from https://nodejs.org/en/
- note, if on Windows, make sure to check the box to install all the other supporting stuff like Chocolatey package manager and Python
> If you still don't have Python 3 installed https://www.python.org/downloads/
- make sure you check the box to add it to the path so your system can use Python globaly

```
cd priceBot
```
```
npm install
```
```
npm run build
```
By default, the .vscode/launch.json is set up for breakpoints in vsCode
Inside of vsCode, click the debug button and then toward top click the green arrow to start the javascript debug terminal

[<img src="https://github.com/spencerdavis2000/pricebot/blob/9b718d2b8bb8a58468750076c07516b4a9f5d471/docs/img/debug.PNG" width="300" height="300">]

You can put in breakpoints in the index.ts if you wish
In index.ts enter currency pair (currencly handles only one)

```
start(['BTCUSD']);
```
```
npm run build
npm run start
```


Output should look like this
![output](https://github.com/spencerdavis2000/pricebot/blob/3dc77261d239ec9f02dec281ab2f7edb7b56fa5b/docs/img/output.PNG)

# Future Plans
- Make it a lambda on aws
- Docker application on EC3 on aws or Azure
- Write unit tests
- Handle multiple currencies
- SMS notifications
- Android/ios app to consume with notifications
- Maybe make it into an express app
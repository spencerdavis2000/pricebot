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

[<img src="docs/img/debug.png" width="200" height="200">]

You can put in breakpoints in the index.ts if you wish

```
npm run start
```

## Deploy to aws lambda with cron as event
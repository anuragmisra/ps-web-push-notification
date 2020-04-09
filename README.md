## Prerequisites

### Install `nvm`

    https://github.com/nvm-sh/nvm

### Installing LTS Node version

    nvm install --lts

The output may look like the following

```txt
nvm install --lts
Installing latest LTS version.
Downloading and installing node v12.16.1...
Downloading https://nodejs.org/dist/v12.16.1/node-v12.16.1-darwin-x64.tar.xz...
############################################################################################################ 100.0%
Computing checksum with shasum -a 256
Checksums matched!
Now using node v12.16.1 (npm v6.13.4)
```

### Installing `ExpressJS`
```sh
npm install express
```

### Start the Server
```sh
node server/serverApp.js
```
This will start the server at [http://localhost:3000](http://localhost:3000). 

The server has an endpoint called `/api/subscribe` that will received `pushSubscription` object and use this object to send notification to the client `every 3 seconds`.

### Start the Client App
```sh
yarn start
```
This will start the app at [http://localhost:9999](http://localhost:9999)

- Once opened, the app will request notification permissions. Please click **Allow** to receive new notifications.  
- Then, click on **ENABLE PUSH NOTIFICATIONS**. This will subscribe this client with the server using `/api/subscribe` endpoint.

Now, open the [Console Panel on Google Chrome](https://developers.google.com/web/tools/chrome-devtools/open#console). You should start to observe the `console` statements with different `tag` ids.
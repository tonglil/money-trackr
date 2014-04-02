# Money Trackr
A cross platform app to keep track of IOUs between friends!

## Install
* MySQL create database money\_trackr
* Install [redis](http://redis.io/)
* Install dependencies `npm install`
* `cp ./app/passwords.js ./app/src/config/passwords.js` and input valid values

## Build Process
* Build it once: `gulp`
* Then to keep track of changes: `gulp watch`

## Server
* Install [nodemon](https://github.com/remy/nodemon)
* `nodemon app/src/money-tracker.js`

## Tests
* Stop server, the run unit and route tests with: `gulp test`

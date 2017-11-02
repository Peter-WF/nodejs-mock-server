# nodejs-mock-server

> A dev mock server for nodejs project, focus on improving development efficiency

## Getting Started

#### 1. Install npm package:
```
$ npm install nodejs-mock-server --save-dev
```
#### 2. Init mock-server:
```javascript
// Boot 
const express = require('express')

require('nodejs-mock-server')

const app = express()

// init mock-server
MS.init({
  app,
  appDir: __dirname
})
```
#### 3. Visit `/mock-server/#/` 

### Usage Example

* [Simple](/doc/usage-examples.md)

### Demo

* [nodejs-simple-demo usage examples](https://github.com/Peter-WF/nodejs-simple-demo)

### Guide && Schematic Diagram

* [Schematic Diagram](/doc/schematic-diagram.md)

## TODO List

* [x] dev server

* [x] request/response intercept 

* [x] guide && schematic diagram

* [ ] add mock feature with mockjs 
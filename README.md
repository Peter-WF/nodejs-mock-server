# nodejs-mock-server

> A dev mock server for nodejs project, focus on improving development efficiency

### Getting Started

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

// add intercept
app.use('/api/*', MS.intercept())
```

demo: [nodejs-simple-demo](https://github.com/Peter-WF/nodejs-simple-demo/blob/master/app/routes/index.js#L22)

#### 3. Visit `/mock-server/#/` 

### Usage Example

* [Simple](/doc/usage-examples.md)

### Guide && Schematic Diagram

* [Schematic Diagram](/doc/schematic-diagram.md)

### TODO List

* [x] dev server

* [x] request/response intercept 

* [x] guide && schematic diagram

* [ ] add mock feature with mockjs 
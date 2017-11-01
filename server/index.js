/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-11-01 18:46
 * @description
 */
'use strict';

const express = require('express')
const path = require('path')
const api = require('./api')

module.exports = {
  init() {
    // 初始化静态资源路由
    MS.use(express.static(path.join(__dirname, './dist')))

    // 初始化编辑页路由
    MS.get('/mock-server/', function(req, res) {
      res.render(path.join(__dirname, './dist/index.html'))
    })

    // 初始化接口路由
    api.init()
  }
}
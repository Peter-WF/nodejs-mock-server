/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-11-02 01:36
 * @description
 */

'use strict';
const glob = require('glob')
const utils = require('../utils')

module.exports = {
  init() {
    // 获取当前已存储的接口列表
    MS.get('/mock-server/api/getCacheFiles', function(req, res, next) {
      glob(MS.appDir + "/mock/.server/**/*.json", function(err, files) {
        if (err) {
          res.send({
            success: false,
            description: err
          })
        } else {
          files = files.map(item => {
            return item.replace(`${MS.appDir}/mock/.server`, '')
          })

          res.send({
            success: true,
            data: {
              files
            }
          })
        }
      })
    })
    // 获取接口数据
    MS.get('/mock-server/api/:method/:type/*', utils.cors, checkMockType, function(req, res, next) {
      const cachePath = utils.getCacheFileAbsolutePath(req.params[0], req.params.method, `.${req.params.type}`)
      res.send(utils.parseData(cachePath))
    })
    // 更新接口数据
    MS.post('/mock-server/api/:method/:type/*', checkMockType, function(req, res, next) {
      try {
        const data = JSON.parse(req.body.JSONString)
        const cachePath = utils.getCacheFileAbsolutePath(req.params[0], req.params.method, `.${req.params.type}`)
        utils.saveData(cachePath, data)
        res.send({
          success: true
        })
      } catch (e) {
        res.send({
          success: false,
          description: e.message
        })
      }
    })
  }
}

// 过滤错误的 mock type
function checkMockType(req, res, next) {
  const mockType = ['local', 'server', 'mock']
  if (mockType.indexOf(req.params.type) === -1) {
    res.send({
      success: false,
      description: '错误的 mock type '
    })
  } else {
    next()
  }
}


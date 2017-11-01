/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-11-02 02:00
 * @description
 */
'use strict';

const fs = require('fs')
const path = require('path')
const vm = require('vm')
const mkdirp = require('mkdirp')
const colors = require('colors')
const merge = require('lodash/merge');

// 避免 mkdirp 写入没有权限的文件夹
process.umask(0);

/**
 * 根据当前 cookie 中的 mockConfig 获取当前请求接口的 mockUrl
 */
function getMockUrl(req) {
  const apiMockStorage = JSON.parse(req.cookies.mockConfig || ' {}')
  const apiPath = req.baseUrl
  const method = req.method
  const mockType = apiMockStorage[`${apiPath}_${method}`]
  if (mockType) {
    return `/mock-server/api/${method}/${mockType}${apiPath}`
  } else if (apiPath.indexOf('/mock-server') !== 0 && req.cookies.globalAgent) {
    return `/mock-server/api/${method}/server${apiPath}`
  }
}

/**
 * 拦截 ServerResponse send 方法 && redirect 至 mock api
 */
function localMockIntercept(req, res, next) {
  // 判断当前请求接口是否需要 mock 数据
  const mockUrl = getMockUrl(req)
  if (mockUrl) {
    console.log(`[utopia-mock] redirect to '${mockUrl}' for mock data`.green);
    res.redirect(mockUrl)
    return
  }

  // 拦截 send 方法 用于数据缓存
  const originSend = res.send
  res.send = function(body) {
    // 仅仅缓存上次请求成功的数据，如果数据请求失败则保存上次的缓存
    if (typeof body === 'object' && body.success) {
      saveData(getCacheFileAbsolutePath(req.path, req.method, '.server'), body)
    }
    originSend.apply(this, arguments)
  }
  next()
}
/**
 * 根据访问链接获取缓存文件绝对路径
 * @param reqPath
 * @param reqMethod
 * @param type 缓存类型 (.local/.server)
 * @returns {string}
 */
function getCacheFileAbsolutePath(reqPath, reqMethod, type) {
  const filePath = reqPath.replace(/^\//, '').replace(/\/$/, '');
  return path.resolve(MS.appDir, `mock/${type}`, `${filePath}_${reqMethod}.json`)
}

/**
 * 使用vm执行代码，解析json文件
 * @param filePath
 * @returns {{}}
 */
function parseData(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath);
  } catch (e) {
    console.warn(`[utopia-mock] Cannot readFile form '${filePath}'`.yellow);
    return {};
  }
  const code = '(' + content + ')';
  const sandbox = {};
  try {
    return vm.runInThisContext(code, sandbox, {
      filename: filePath,
      displayErrors: false,
      timeout: 1000
    });
  } catch (e) {
    console.warn(`[utopia-mock] Cannot transform '${filePath}' into JSON`.yellow);
    console.error(e);
    return {};
  }
}

/**
 * 存储数据
 * @param filePath
 * @param data
 */
function saveData(filePath, data) {
  return new Promise((resolve, reject) => {
    const dirPath = filePath.replace(/(.*)\/[^\/]*$/g, '$1')
    // 创建文件夹
    mkdirp(dirPath, function(err) {
      if (err) {
        console.error(`[utopia-mock] Cannot mkdir ${dirPath}`.yellow);
        console.error(err)
      } else {
        try {
          fs.writeFile(filePath, JSON.stringify(data, null, '  '), function(err) {
            if (err) {
              console.error(err)
            }
            resolve(data)
          })
        } catch (err) {
          console.error(`[utopia-mock] Cannot write into ${filePath}`.red);
          console.error(err)
        }
      }
    });
  })
}

module.exports = {
  localMockIntercept,
  getCacheFileAbsolutePath,
  saveData,
  parseData
}
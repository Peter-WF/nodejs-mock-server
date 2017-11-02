/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-11-02 10:17
 * @description
 */

'use strict';

module.exports = {
  init() {
    MS.use('/api/*', require('./intercept'))
  }
}

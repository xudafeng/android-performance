/* ================================================================
 * android-performance by xdf(xudafeng[at]126.com)
 *
 * first created at : Thu Jun 30 2016 09:58:47 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright  xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var AndroidPerformance = require('..');

describe('test', function() {
  it('should be ok', function() {
    console.log(AndroidPerformance);
    AndroidPerformance.should.be.ok();
  });

  it('should init device success', function(done) {
    var perf = new AndroidPerformance();
    perf.initDevice(function(err, device) {
      if (err) {
        console.log(err);
        done();
      }
      console.log(device);
      done();
    });
  });

  it('should get meminfo success', function *() {
    var perf = new AndroidPerformance();
    yield perf.initDevice();
    var res = yield perf.getMeminfoByPackageName('com.android.settings');
    console.log(res);
  });
});

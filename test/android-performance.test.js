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

  it('should get meminfo success', function*() {
    var perf = new AndroidPerformance();
    yield perf.initDevice();
    var res = yield perf.getMeminfoByPackageName('com.android.phone');
    console.log(res);
  });

  it('should get pid success', function*() {
    var perf = new AndroidPerformance();
    yield perf.initDevice();
    var res = yield perf.getPid('com.android.phone');
    console.log(res);
  });

  it('should get threadcount success', function*() {
    var perf = new AndroidPerformance();
    yield perf.initDevice();
    var pid = yield perf.getPid('com.android.phone');
    var res = yield perf.getThreadCountByPid(pid);
    console.log(res);
  });

  it('should get uid success', function*() {
    var perf = new AndroidPerformance();
    yield perf.initDevice();
    var pid = yield perf.getPid('com.android.phone');
    var uid = yield perf.getUidByPid(pid);
    console.log(uid);
  });

  it('should get traffic success', function*() {
    var perf = new AndroidPerformance();
    yield perf.initDevice();
    var pid = yield perf.getPid('com.android.phone');
    var uid = yield perf.getUidByPid(pid);
    var res = yield perf.getTrafficByUid(uid);
    console.log(res);
  });

  it('should get CPU success', function*() {
    var perf = new AndroidPerformance();
    yield perf.initDevice();
    var pid = yield perf.getPid('com.android.phone');
    var res = yield perf.getCPUByPid(pid);
    console.log(res);
  });
});

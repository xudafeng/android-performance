'use strict';

const AndroidPerformance = require('..');

const pkgName = 'com.android.phone';

describe('test', function() {
  it('should be ok', function() {
    console.log(AndroidPerformance);
    AndroidPerformance.should.be.ok();
  });

  it('should init device success', function(done) {
    const perf = new AndroidPerformance();
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
    const perf = new AndroidPerformance();
    yield perf.initDevice();
    const res = yield perf.getMeminfoByPackageName(pkgName);
    console.log(res);
  });

  it('should get pid success', function *() {
    const perf = new AndroidPerformance();
    yield perf.initDevice();
    const res = yield perf.getPid(pkgName);
    console.log(res);
  });

  it('should get threadcount success', function *() {
    const perf = new AndroidPerformance();
    yield perf.initDevice();
    const pid = yield perf.getPid(pkgName);
    const res = yield perf.getThreadCountByPid(pid);
    console.log(res);
  });

  it('should get uid success', function *() {
    const perf = new AndroidPerformance();
    yield perf.initDevice();
    const pid = yield perf.getPid(pkgName);
    const uid = yield perf.getUidByPid(pid);
    console.log(uid);
  });

  it('should get traffic success', function *() {
    const perf = new AndroidPerformance();
    yield perf.initDevice();
    const pid = yield perf.getPid(pkgName);
    const uid = yield perf.getUidByPid(pid);
    const res = yield perf.getTrafficByUid(uid);
    console.log(res);
  });

  it('should get CPU success', function *() {
    const perf = new AndroidPerformance();
    yield perf.initDevice();
    const pid = yield perf.getPid(pkgName);
    const res = yield perf.getCPUByPid(pid);
    console.log(res);
  });

  it('should all in one with promise', function(done) {
    const perf = new AndroidPerformance();
    const p1 = new Promise((resolve, reject) => {
      perf
        .initDevice()
        .then(() => perf.getMeminfoByPackageName(pkgName))
        .then(res => {
          resolve({
            item: 'Meminfo',
            data: res
          });
        });
    });

    const p2 = new Promise((resolve, reject) => {
      perf
        .initDevice()
        .then(() => perf.getPid(pkgName))
        .then(pid => {
          return perf
            .getThreadCountByPid(pid)
            .then(d => {
              resolve({
                item: 'ThreadCount',
                data: d
              });
            })
            .catch(e => {
              resolve(null);
            });
        })
        .catch(e => {
          resolve(null);
        });
    });

    const p3 = new Promise((resolve, reject) => {
      perf
        .initDevice()
        .then(() => perf.getPid(pkgName))
        .then(pid => {
          return perf
            .getUidByPid(pid)
            .then(uid => {
              return perf
                .getTrafficByUid(uid)
                .then(d => {
                  resolve({
                    item: 'Traffic',
                    data: d
                  });
                })
                .catch(e => {
                  resolve(null);
                });
            })
            .catch(e => {
              resolve(null);
            });
        })
        .catch(e => {
          resolve(null);
        });
    });

    const p4 = new Promise((resolve, reject) => {
      perf
        .initDevice()
        .then(() => perf.getPid(pkgName))
        .then(pid => {
          return perf
            .getCPUByPid(pid)
            .then(d => {
              resolve({
                item: 'cpu',
                data: d
              });
            })
            .catch(e => {
              resolve(null);
            });
        });
    });

    Promise.all([p1, p2, p3, p4]).then(result => {
      console.log(`performance：${JSON.stringify(result)}`);
      done();
    });
  });
});

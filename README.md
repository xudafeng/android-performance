# android-performance

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/android-performance.svg?style=flat-square
[npm-url]: https://npmjs.org/package/android-performance
[travis-image]: https://img.shields.io/travis/xudafeng/android-performance.svg?style=flat-square
[travis-url]: https://travis-ci.org/xudafeng/android-performance
[coveralls-image]: https://img.shields.io/coveralls/xudafeng/android-performance.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/xudafeng/android-performance?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/android-performance.svg?style=flat-square
[download-url]: https://npmjs.org/package/android-performance

> Node.js wrapper to android performance with adb

## Installment

```bash
$ npm i android-performance --save-dev
```

## Usage

```javascript
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
```

## License

The MIT License (MIT)

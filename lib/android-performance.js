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

const ADB = require('macaca-adb');

const _ = require('./helper');

function AndroidPerformance() {
  this.adb = null;
  this.udid = null;
  this.init();
}

AndroidPerformance.prototype.init = function() {
  this.initAdb();
};

AndroidPerformance.prototype.initAdb = function() {
  this.adb = new ADB();
};

AndroidPerformance.prototype.initDevice = function() {
  var args = Array.prototype.slice.call(arguments);

  var promise = new Promise((resolve, reject) => {
    ADB.getDevices().then(devices => {
      if (devices.length) {
        var device = devices[0];
        this.adb.setDeviceId(device.udid);
        this.udid = device.udid;
        resolve(devices);
      } else {
        console.log('no device');
      }
    }).catch(err => {
      reject(`get devices error with: ${err}`);
    });
  });

  if (args.length) {
    var cb = args[0];

    promise.then(data => {
      cb.call(this, null, data);
    }).catch(err => {
      cb.call(this, err);
    });
  } else {
    return promise;
  }
};

AndroidPerformance.prototype.getMeminfoByPackageName = function() {
  var args = Array.prototype.slice.call(arguments);
  var name = args[0];

  var cmd = `dumpsys meminfo ${name}`;

  var promise = new Promise((resolve, reject) => {
    this.adb.shell(cmd).then(data => {
      resolve(data);
    }).catch(err => {
      reject(`exec ${cmd} error with: ${err}`);
    });
  });

  if (args.length > 1) {
    var cb = args[1];

    promise.then(data => {
      cb.call(this, null, data);
    }).catch(err => {
      cb.call(this, err);
    });
  } else {
    return promise;
  }
};

module.exports = AndroidPerformance;

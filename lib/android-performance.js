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
      }else{
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
  }else{
    return promise;
  }
};

AndroidPerformance.prototype.getMeminfoByPackageName = function() {
  var args = Array.prototype.slice.call(arguments);
  var name = args[0];

  var cmd = `dumpsys meminfo ${name}`;
  var paser = function(data){
    return _.find(data.split('\n'), function(line){
             return _.startsWith(line.trim(), 'TOTAL ');
           }).trim().split(/\s+/g);
  };

  var promise = new Promise((resolve, reject) => {
    this.adb.shell(cmd).then(data => {
      var sec = paser(data);
      resolve(sec[1]);
    }).catch(err => {
      reject(`exec ${cmd} error with: ${err}`);
    });
  });

  if(args.length > 1){
    var cb = args[1];
    promise.then(data => {
      var sec = paser(data);
      cb.call(this, null, sec[1]);
    }).catch(err => {
      cb.call(this, err);
    });
  }else{
    return promise;
  }
};

AndroidPerformance.prototype.getPid = function () {
  var args = Array.prototype.slice.call(arguments);
  var name = args[0];

  var cmd = `ps`;
  var parser = function(data){
    return _.find(data.split('\n'), function(line){
             return line.includes(name);
           }).trim().split(/\s+/g);
  };

  var promise = new Promise((resolve, reject) => {
    this.adb.shell(cmd).then(data => {
      var sec = parser(data);
      resolve(sec[1]);
    }).catch(err => {
      reject(`exec ${cmd} error with: ${err}`);
    });
  });

  if(args.length > 1){
    var cb = args[1];
    promise.then(data => {
      var sec = parser(data);
      cb.call(this, null, sec[1]);
    }).catch(err => {
      cb.call(this, err);
    });
  }else{
    return promise;
  }
};

AndroidPerformance.prototype.getThreadCountByPid = function () {
  var args = Array.prototype.slice.call(arguments);
  var pid = args[0];

  var cmd = `cat /proc/${pid}/status`;
  var paser = function(data){
    return _.find(data.split('\n'), function(line){
             return line.includes('Threads');
           }).trim().split(/\s+/g);
  };

  var promise = new Promise((resolve, reject) => {
    this.adb.shell(cmd).then(data => {
      var sec = paser(data);
      resolve(sec[1]);
    }).catch(err => {
      reject(`exec ${cmd} error with: ${err}`);
    });
  });

  if(args.length > 1){
    var cb = args[1];
    promise.then(data => {
      var sec = paser(data);
      cb.call(this, null, sec[1]);
    }).catch(err => {
      cb.call(this, err);
    });
  }else{
    return promise;
  }
};

AndroidPerformance.prototype.getUidByPid = function () {
  var args = Array.prototype.slice.call(arguments);
  var pid = args[0];

  var cmd = `cat /proc/${pid}/status`;
  var parser = function(data){
    return _.find(data.split('\n'), function(line){
             return line.includes('Uid');
           }).trim().split(/\s+/g);
  };

  var promise = new Promise((resolve, reject) => {
    this.adb.shell(cmd).then(data => {
      var sec = parser(data);
      resolve(sec[1]);
    }).catch(err => {
      reject(`exec ${cmd} error with: ${err}`);
    });
  });

  if(args.length > 1){
    var cb = args[1];
    promise.then(data => {
      var sec = parser(data);
      cb.call(this, null, sec[1]);
    }).catch(err => {
      cb.call(this, err);
    });
  }else{
    return promise;
  }
};

AndroidPerformance.prototype.getTrafficByUid = function () {
  var args = Array.prototype.slice.call(arguments);
  var uid = args[0];

  var cmd = `cat /proc/net/xt_qtaguid/stats`;
  var parser = function(data){
    var res = {
      wifi: {
        rcv: 0,
        snd: 0
      },
      mobie: {
        rcv: 0,
        snd: 0
      }
    };
    var uidx, typex, rcvx, sndx;

    _.forEach(data.split('\n'), function(line){
      var token = line.trim().split(/\s+/g);
      if(token[0] === 'idx'){
        uidx = _.indexOf(token, 'uid_tag_int');
        typex = _.indexOf(token, 'iface');
        rcvx = _.indexOf(token, 'rx_bytes');
        sndx = _.indexOf(token, 'tx_bytes');
      }else if(token[uidx] === uid){
        if(token[typex].includes('wlan')){
          res.wifi.rcv += token[rcvx];
          res.wifi.snd += token[sndx];
        }else{
          res.mobile.rcv += token[rcvx];
          res.mobile.rcv += token[sndx];
        }
      }
    });
    return res;
  };

  var promise = new Promise((resolve, reject) => {
    this.adb.shell(cmd).then(data => {
      var res = parser(data);
      resolve(res);
    }).catch(err => {
      reject(`exec ${cmd} error with: ${err}`);
    });
  });

  if(args.length > 1){
    var cb = args[1];
    promise.then(data => {
      var res = parser(data);
      cb.call(this, null, res);
    }).catch(err => {
      cb.call(this, err);
    });
  }else{
    return promise;
  }
};

AndroidPerformance.prototype.getCPUByPid = function () {
  var args = Array.prototype.slice.call(arguments);
  var pid = args[0];

  var cmd = `top -n 1`;
  var parser = function(data){
    return _.find(data.split('\n'), function(line){
             return line.includes(pid);
           }).trim().split(/\s+/g);
  };

  var promise = new Promise((resolve, reject) => {
    this.adb.shell(cmd).then(data => {
      var sec = parser(data);
      resolve(sec[2]);
    }).catch(err => {
      reject(`exec ${cmd} error with: ${err}`);
    });
  });

  if(args.length > 1){
    var cb = args[1];
    promise.then(data => {
      var sec = parser(data);
      cb.call(this, null, sec[2]);
    }).catch(err => {
      cb.call(this, err);
    });
  }else{
    return promise;
  }
};

module.exports = AndroidPerformance;

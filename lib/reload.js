'use strict';

var _        = require('lodash');
var chokidar = require('chokidar');
var MODULE   = require('module');
var stack    = require('callsite');
var watch    = new chokidar.FSWatcher({ ignored: /[\/\\]\./, persistent: true });
var methods  = {};

function reload(required) {
  var modulePath = resolve(required);
  watch.add(modulePath);

  load(modulePath);
  return methods[modulePath];
}

function resolve(required) {
  var moduleFilename = stack()[2].getFileName();
  return MODULE._resolveFilename(required, require.cache[moduleFilename]);
}

function swap(modulePath) {
  var moduleCache = require.cache[modulePath];

  _.each(moduleCache.exports, function (v, k) {
    moduleCache.exports[k] = null
    delete moduleCache.exports[k];
  });

  var tmpModulePath = modulePath + '.tmp';
  require.cache[tmpModulePath] = require.cache[modulePath];
  delete require.cache[modulePath];

  load(modulePath);
  require.cache[modulePath] = require.cache[tmpModulePath];
  delete require.cache[tmpModulePath];

  _.each(methods[modulePath], function (v, k) {
    moduleCache.exports[k] = methods[modulePath][k];
  });
}

function load(modulePath) {
  methods[modulePath] = require(modulePath);
}

watch.on('change', swap);

module.exports = reload;

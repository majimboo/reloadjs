'use strict';

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
  var exportKeys = Object.keys(moduleCache.exports);

  for (var i = 0; i < exportKeys.length; i++) {
    var exportKey = exportKeys[i];
    moduleCache.exports[exportKey] = null
    delete moduleCache.exports[exportKey];
  }

  var tmpModulePath = modulePath + '.tmp';
  require.cache[tmpModulePath] = require.cache[modulePath];
  delete require.cache[modulePath];

  load(modulePath);
  require.cache[modulePath] = require.cache[tmpModulePath];
  delete require.cache[tmpModulePath];

  var methodKeys = Object.keys(methods[modulePath]);

  for (var i = 0; i < methodKeys.length; i++) {
    var methodKey = methodKeys[i];
    moduleCache.exports[methodKey] = methods[modulePath][methodKey];
  }
}

function load(modulePath) {
  methods[modulePath] = require(modulePath);
}

watch.on('change', swap);

module.exports = reload;

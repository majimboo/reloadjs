ReloadJS [![Build Status](https://travis-ci.org/majimboo/reloadjs.svg?branch=master)](https://travis-ci.org/majimboo/reloadjs)
====

[![NPM](https://nodei.co/npm/reloadjs.png?downloads=true)](https://nodei.co/npm/reloadjs/)

Reload is a hotcode reload for node.js. Ideal for servers in development.

Install
-------

    npm install reloadjs --save

Installing the latest version

    $ npm install git+https://github.com/majimboo/reloadjs.git

Usage
-----

    var reload = require('reloadjs');

    var reloadable = reload('./reloadable');

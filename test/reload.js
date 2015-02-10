var fs     = require('fs');
var path   = require('path');
var should = require('should');
var reload = require('../');
var MODULE = path.join(__dirname, 'reloadable.js');

var reloadable = reload('./reloadable');

describe('reload', function() {
  var version = 1;

  beforeEach(function (done) {
    fs.writeFile(MODULE, 'module.exports.version = ' + (version++) + ';');
    setTimeout(done, 200);
  });

  after(function (done) {
    fs.writeFile(MODULE, 'module.exports.version = 0;', done);
  });

  it('should reload get version 1', function (done) {
    reloadable.version.should.equal(1);
    done();
  });

  it('should reload get version 2', function (done) {
    reloadable.version.should.equal(2);
    done();
  });

  it('should reload get version 3', function (done) {
    reloadable.version.should.equal(3);
    done();
  });

  it('should reload get version 4', function (done) {
    reloadable.version.should.equal(4);
    done();
  });

});

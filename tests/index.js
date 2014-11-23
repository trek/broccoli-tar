'use strict';

var path = require('path');
var expect = require('expect.js');
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

require('mocha-jshint')();

var TarGzip = require('..');

// sorry I'm horrible.
describe('broccoli-targz', function(){
  var fixturePath = path.join(__dirname, 'fixtures');
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('emits an archive.gz file', function() {});
  it('the tar contains the file from input the input tree', function(){});
  it('emits an <name>.gz file if options.name is set')
});

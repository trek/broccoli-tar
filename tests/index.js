/* global require, module */

var path = require('path');
var expect = require('expect.js');
var walkSync = require('walk-sync');
var broccoli = require('broccoli');
var fs = require('fs');

// require('mocha-jshint')();

var Zip = require('..');

describe('broccoli-zip', function(){
  'use strict';

  var fixturePath = path.join(__dirname, 'fixtures');
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('emits an archive.zip file', function() {
    var inputPath = path.join(fixturePath);
    var tree = new Zip(inputPath);

    builder = new broccoli.Builder(tree);
    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;
        expect(fs.existsSync(outputPath + '/archive.zip'));
      });

  });

  it('the zip contains the file from input the input tree');

  it('emits an <name>.zip file if options.name is set', function(){
    var inputPath = path.join(fixturePath);
    var tree = new Zip(inputPath);

    builder = new broccoli.Builder(tree, 'name');
    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;
        expect(fs.existsSync(outputPath + '/name.zip'));
      });
  });

  it('supports non-constructor pattern', function () {
    var inputPath = path.join(fixturePath);
    var tree = Zip(inputPath);
    expect(tree).to.be.a(Zip);
  });
});

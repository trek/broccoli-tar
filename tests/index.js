'use strict';

var path = require('path');
var expect = require('expect.js');
var walkSync = require('walk-sync');
var broccoli = require('broccoli');
var fs = require('fs');

// require('mocha-jshint')();

var Tar = require('..');

describe('broccoli-targz', function(){
  var fixturePath = path.join(__dirname, 'fixtures');
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('emits an archive.gz file', function() {
    var inputPath = path.join(fixturePath);
    var tree = new Tar(inputPath);

    builder = new broccoli.Builder(tree);
    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;
        expect(fs.existsSync(outputPath + '/archive.tar.gz'));
      });

  });

  it('the tar contains the file from input the input tree');

  it('emits an <name>.gz file if options.name is set', function(){
    var inputPath = path.join(fixturePath);
    var tree = new Tar(inputPath);

    builder = new broccoli.Builder(tree, 'name');
    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;
        expect(fs.existsSync(outputPath + '/name.tar.gz'));
      });
  });
  
  it('supports non-constructor pattern', function () {
    var inputPath = path.join(fixturePath);
    var tree = Tar(inputPath);
    expect(tree).to.be.a(Tar);
  });
});

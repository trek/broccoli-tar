'use strict';

var path = require('path');
var expect = require('expect.js');
var broccoli = require('broccoli');
var fs = require('fs');
var zlib = require('zlib');
var walkSync = require('walk-sync');
var tarPackage = require('tar');

require('mocha-jshint')();

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

  it('the tar contains the files and structure of the input tree', function(done){
    var inputPath = path.join(fixturePath);
    var tree = new Tar(inputPath);

    builder = new broccoli.Builder(tree);
    builder.build()
      .then(function(results){
        var file = results.directory + '/archive.tar.gz';
        var parser = tarPackage.Parse();
        var srcEntries = walkSync(inputPath);
        var tarEntries = [];

        fs.createReadStream(file).pipe(zlib.createGunzip()).pipe(parser);

        parser.on('entry', function (e){
          tarEntries.push(e.path);
        });

        parser.on('end', function (){
          expect(tarEntries.length).to.equal(srcEntries.length);

          srcEntries.forEach(function (src){
            expect(tarEntries.indexOf(src)).to.be.above(-1);
          });

          done();
        });
      }).catch(done);
  });

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
});

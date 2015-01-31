var RSVP = require('rsvp');
var quickTemp = require('quick-temp');
var fs = require('fs');
var path = require('path');
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');

var TarGzip = function TarGzip(inputTree, name){
  this.inputTree = inputTree;
  this.name = name || 'archive';
};

TarGzip.prototype = {
  read: function(readTree){
    var destDir = quickTemp.makeOrRemake(this, 'tmpDestDir');

    var outName = this.name;
    var tarName = [destDir, '/', outName, '.tar.gz'].join('');

    return readTree(this.inputTree).then(function (srcDir){
      return new RSVP.Promise(function (resolve, reject) {
        var tStream = tarStream(srcDir, true);
        var writer = fs.createWriteStream(tarName);
        var gz = zlib.createGzip();

        tStream.on('error', reject);
        gz.on('error', reject);
        writer.on('error', reject);
        writer.on('finish', function (){
          resolve(destDir);
        });

        tStream.pipe(gz).pipe(writer);
      });
    });
  },
  cleanup: function(){
    quickTemp.remove(this, 'tmpDestDir');
  }
};

function tarStream(srcDir, changeCWD){
  srcDir = path.resolve(srcDir);

  var fstreamOpts = {
    path: srcDir,
    follow: true,
  };

  if (changeCWD) {
    fstreamOpts.filter = function(){
      if (this.dirname === srcDir) {
        this.root = this.props.root = null;
      }
      return true;
    };
  }

  var reader = fstream.Reader(fstreamOpts);
  var packer = tar.Pack();

  if (changeCWD) {
    packer.removeListener('pipe', packer.listeners('pipe')[0]);
  }

  return reader.pipe(packer);
}

module.exports = TarGzip;

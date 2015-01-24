var RSVP = require('rsvp');
var quickTemp = require('quick-temp');
var fs = require('fs');
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
        var reader = fstream.Reader({path: srcDir, follow: true});
        var writer = fs.createWriteStream(tarName);
        var packer = tar.Pack();
        var gz = zlib.createGzip();

        reader.on('error', reject);
        gz.on('error', reject);
        writer.on('error', reject);
        writer.on('finish', function (){
          resolve(destDir);
        });

        reader.pipe(packer).pipe(gz).pipe(writer);
      });
    });
  },
  cleanup: function(){
    quickTemp.remove(this, 'tmpDestDir');
  }
};

module.exports = TarGzip;

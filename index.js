var tar = require("tar");
var fstream = require("fstream")
var fs = require("fs");

var RSVP = require('rsvp');
var quickTemp = require('quick-temp');

TarGzip = function TarGzip(inputTree, options){
  this.inputTree = inputTree;
  this.options = options || {};
  this.options.name = this.options.name || 'archive';
}

TarGzip.prototype = {
  read: function(readTree){
    var destDir = quickTemp.makeOrRemake(this, 'tmpDestDir');
    var outName = this.options.name;
    var tarName = [destDir, '/', outName, '.tar'].join('');

    var tarFile = fs.createWriteStream(tarName)

    return readTree(this.inputTree).then(function (srcDir){
      return new RSVP.Promise(function(resolve, reject){

        var packer = tar.Pack({ noProprietary: true })
          .on('error', reject)
          .on('end', function(){ resolve(destDir); });

        // This must be a "directory"
        fstream.Reader({ path: srcDir, type: "Directory", follow: true})
          .on('error', reject)
          .pipe(packer)
          .pipe(tarFile);
      });
    });
  },
  cleanup: function(){
    quickTemp.remove(this, 'tmpDestDir');
  }
};

module.exports = TarGzip;
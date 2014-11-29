var fs = require("fs");
var RSVP = require('rsvp');
var quickTemp = require('quick-temp');
var walkSync = require('walk-sync');
var Tar = require('tar-async/tar');

TarGzip = function TarGzip(inputTree, options){
  this.inputTree = inputTree;
  this.options = options || {};
  this.options.name = this.options.name || 'archive';
}

function onError(e){
  console.warn(e);
}

TarGzip.prototype = {
  read: function(readTree){
    var destDir = quickTemp.makeOrRemake(this, 'tmpDestDir');
    var outName = this.options.name;
    var tarName = [destDir, '/', outName, '.tar'].join('');

    return readTree(this.inputTree).then(function (srcDir){
      var paths = walkSync(srcDir);
      var tape = new Tar({output: fs.createWriteStream(tarName)});

      var writes = paths.map(function(p){
        var path = srcDir + "/" + p;

        if (fs.lstatSync(path).isDirectory()) {
          return new RSVP.Promise(function(resolve, reject){ resolve(true)});
        }

        return new RSVP.Promise(function(resolve, reject){
          var f = fs.createReadStream(srcDir + "/" + p).on('error', reject);
          tape.append(p, f, {allowPipe: true}, resolve);
        });
      });


      return RSVP.all(writes).then(function(){
        console.log("????");
        return destDir;
      });
    });
  },
  cleanup: function(){
    quickTemp.remove(this, 'tmpDestDir');
  }
};

module.exports = TarGzip;
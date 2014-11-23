var targz = require('tar.gz');
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

    return readTree(this.inputTree).then(function (srcDir){
      return new RSVP.Promise(function(resolve, reject) {
        var outfile = [destDir, '/', outName, '.tar.gz'].join('');
        new targz().compress(srcDir, outfile, function(err){
          if (err) {
            reject(err);
          } else {
            resolve(destDir);
          }
        });
      });
    });
  },
  cleanup: function(){
    quickTemp.remove(this, 'tmpDestDir');
  }
};

module.exports = TarGzip;
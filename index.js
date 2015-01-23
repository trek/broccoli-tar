var RSVP = require('rsvp');
var quickTemp = require('quick-temp');
var exec = RSVP.denodeify(require('child_process').exec);

TarGzip = function TarGzip(inputTree, name){
  this.inputTree = inputTree;
  this.name = name || 'archive';
}

TarGzip.prototype = {
  read: function(readTree){
    var destDir = quickTemp.makeOrRemake(this, 'tmpDestDir');

    var outName = this.name;
    var tarName = [destDir, '/', outName, '.tar.gz'].join('');

    return readTree(this.inputTree).then(function (srcDir){
      var args = ['tar', 'chz', '-C', srcDir, '-f', tarName, '.'].join(' ');
      return exec(args).then(function(){
        return destDir;
      });
    });
  },
  cleanup: function(){
    quickTemp.remove(this, 'tmpDestDir');
  }
};

module.exports = TarGzip;
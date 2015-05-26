var RSVP = require('rsvp');
var quickTemp = require('quick-temp');
var exec = RSVP.denodeify(require('child_process').exec);

function Zip(inputTree, archiveName){
  if (!(this instanceof Zip)) {
    return new Zip(inputTree, archiveName);
  }
  this.inputTree = inputTree;
  this.archiveName = archiveName || 'archive';
}

Zip.prototype.read = function read(readTree){
  var destDir = quickTemp.makeOrRemake(this, 'tmpDestDir');

  var outName = this.archiveName;
  var zipFilename = [destDir, '/', outName, '.zip'].join('');

  return readTree(this.inputTree).then(function (srcDir){
    // var args = ['tar', 'chz', '-C', srcDir, '-f', zipFilename, '.'].join(' ');
    var args = ['zip', '-r', zipFilename, srcDir].join(' ');
    return exec(args).then(function(){
      return destDir;
    });
  });
};

Zip.prototype.cleanup = function cleanup(){
  quickTemp.remove(this, 'tmpDestDir');
};

module.exports = Zip;

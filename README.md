# broccoli-tar

Broccoli tar takes a tree passed from another broccoli plugin
and creates a gzipped tar archive containing those files.

You can supply an optional archive name. The default is `'archive.tar.gz'`:

```javascript
/*
  Given a file structure like this:
  src/css
  ├── reset.css
  └── todos.css
*/

var Funnel = require('broccoli-funnel');
var Tar = require('broccoli-tar');

var cssFiles = new Funnel('src/css');
var archive = new Tar(cssFiles, 'css');


/*
  Results in a output of
  ── css.tar.gz

  When decompressed and untarred will result in the files

  css
  ├── reset.css
  └── todos.css
*/

module.exports = archive;
```
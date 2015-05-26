# broccoli-zip

Broccoli zip takes a tree passed from another broccoli plugin
and creates a zip archive containing those files.

### Dependencies

- `zip` executable, for now

### Usage

You can supply an optional archive name. The default is `'archive.zip'`:

```javascript
/*
  Given a file structure like this:
  src/css
  ├── reset.css
  └── todos.css
*/

var Funnel = require('broccoli-funnel');
var Zip = require('broccoli-zip');

var cssFiles = new Funnel('src/css');
var archive = new Zip(cssFiles, 'css');

/*
  Results in a output of:
  /
  ├── css.zip

  When unzipped, will result in the files:

  /css
  ├── reset.css
  └── todos.css
*/

module.exports = archive;
```

### Credits

Heavily based on the `broccoli-targz` plugin (https://github.com/trek/broccoli-tar) by Trek Glowacki (https://github.com/trek)

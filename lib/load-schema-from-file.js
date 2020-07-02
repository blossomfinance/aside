'use strict';

const path = require('path');

const loadYaml = require('./load-yaml-file');

module.exports = function loadSchemaFromFile(basename, opts = {}) {
  basename = opts && opts.srcExt && !basename.match(opts.srcExt) ?
    `${basename}${opts.srcExt}` :
    basename;
  const srcFilename = opts && opts.srcDir && !basename.match(opts.srcDir) ?
    path.join(opts.srcDir, basename) :
    basename;
  // TODO: json versus yaml
  return loadYaml(srcFilename);
};

'use strict';

const path = require('path');
const pascalCase = require('pascal-case').pascalCase;

module.exports = function schemaFilenameToId(schemaFilename, opts = {}) {
  opts.srcExt = opts.srcExt || '.schema.yml';
  const base = path.basename(schemaFilename);
  const stripped = base.replace(opts.srcExt, '');
  return pascalCase(stripped);
};

'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

module.exports = function loadYamlFile(srcFilename) {
  const src = fs.readFileSync(srcFilename, 'utf8');
  return yaml.safeLoad(src);
};

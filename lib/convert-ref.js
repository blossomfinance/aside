'use strict';

const path = require('path');
const traverse = require('traverse');

module.exports = function convertRef(nodes, options = {}) {
  options.srcExt = options.srcExt || '.schema.yml';
  options.targetExt = options.targetExt || '.schema.json';
  options.path = options.path || '';

  traverse(nodes).forEach(function (value) {
    if (!this.isLeaf) {
      return;
    }
    if ('$ref' !== this.key) {
      return;
    }
    if (!value.match(options.srcExt)) {
      return;
    }
    const converted = value.replace(options.srcExt, options.targetExt);
    this.update(`${path.join(options.path, converted)}`, true);
  });
};

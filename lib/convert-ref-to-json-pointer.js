'use strict';

const traverse = require('traverse');

const schemaFilenameToId = require('./../lib/schema-filename-to-id');

module.exports = function convertRefToJsonPointer(nodes, srcExt = '.schema.yml') {
  traverse(nodes).forEach(function (value) {
    if (!this.isLeaf) {
      return;
    }
    if ('$ref' !== this.key) {
      return;
    }
    if (!value.match(srcExt)) {
      return;
    }
    this.update(`all.schema.json/definitions/${schemaFilenameToId(value)}`, true);
  });
};

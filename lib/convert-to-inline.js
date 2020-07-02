'use strict';

const path = require('path');
// const merge = require('deepmerge');
const traverse = require('traverse');

const schemaFilenameToId = require('./schema-filename-to-id');
const loadSchemaFromFile = require('./load-schema-from-file');

function convertSchemaToInline(rootSchema, subSchema, opts) {
  opts.removeKeys = opts.removeKeys || [];
  const rootTraversable = traverse(rootSchema);
  const subSchemaTraversable = traverse(subSchema);
  const refs = [];
  subSchemaTraversable.forEach(function(value) {
    if (!this.isLeaf) {
      return;
    }
    if ('$ref' !== this.key) {
      if (-1 === opts.removeKeys.indexOf(this.key)) {
        return;
      }
      this.remove(true);
      return;
    }
    if (!value.match(opts.srcExt)) {
      return;
    }

    // convert to JSON pointer
    const id = schemaFilenameToId(value, opts);
    const $ref = `#/definitions/${id}`;
    this.update($ref);

    // collect to load inline later
    refs.push({
      filename: value,
      id
    });
  });

  refs.forEach(ref => {
    // ensure schema is loaded
    const path = ['definitions', ref.id];
    if (rootTraversable.has(path)) {
      return;
    }
    const childSchema = loadSchemaFromFile(ref.filename, opts);
    rootTraversable.set(path, childSchema);
    convertSchemaToInline(rootSchema, childSchema, {...opts, ...{
      removeKeys: ['$id', '$async', '$schema']
    }});
  });
}

module.exports = function convertToInline(rootSchema, opts = {}) {
  opts.srcExt = opts.srcExt || '.schema.json';
  opts.srcDir = opts.srcDir || path.join(__dirname, '/../schemas');
  const schema = {...rootSchema};
  convertSchemaToInline(schema, schema, opts);
  return schema;
}

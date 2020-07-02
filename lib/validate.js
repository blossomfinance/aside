#!/usr/bin/env node

'use strict';

const Ajv = require('ajv');
const fs = require('fs').promises;
const yaml = require('js-yaml');
const path = require('path');

const loadYamlFile = require('./load-yaml-file');

const defaults = {
  srcDir: path.join(__dirname, '/../schemas'),
  srcExtRegex: /\.schema\.yml$/,
  srcExt: '.schema.yml',
};

module.exports = async function validate(schemaName, data, opts = {}) {
  opts.srcExt = opts.srcExt || defaults.srcExt;
  opts.srcDir = opts.srcDir || defaults.srcDir;
  opts.srcExtRegex = opts.srcExtRegex || defaults.srcExtRegex;

  const ajv = new Ajv({
    loadSchema: async function (uri) {
      if (uri.match(opts.srcExtRegex)) {
        const destFilename = `${opts.srcDir}/${uri}`;
        return loadYamlFile(destFilename);
      }
      throw new Error(`Unsupported file type/path: "${uri}"`);
    },
  });

  const schemaFilename = schemaName.match(opts.srcExtRegex) ?
    path.join(opts.srcDir, schemaName) :
    path.join(opts.srcDir, `${schemaName}${opts.srcExt}`);
  const schemaFileContent = await fs.readFile(schemaFilename, 'utf8');
  const schema = yaml.safeLoad(schemaFileContent);
  const validate = await ajv.compileAsync(schema);
  return validate(data);
};

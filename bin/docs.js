#!/usr/bin/env node

'use strict';

const assert = require('assert');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yaml = require('js-yaml');
const ora = require('ora');
const template = require('lodash.template');

const schemaFilenameToId = require('./../lib/schema-filename-to-id');

const srcDir = path.join(__dirname, '/../schemas');
const srcExt = '.schema.yml';
const srcPattern = `${srcDir}/*${srcExt}`;
const destSchemaExt = '.schema.json';

const destDir = path.join(__dirname, '/../docs');
const destExt = '.md';

const templateSrcFilename = path.join(destDir, 'schema.md.tpl');
const templateSrc = fs.readFileSync(templateSrcFilename, 'utf8');

function docFilename(schemaFilename) {
  return schemaFilename.replace(srcExt, destExt);
}

const compiledTemplate = template(templateSrc, {
  imports: {
    docFilename,
    renderTemplateForSchema,
    renderTemplateForSchemaRef,
    schemaFilenameToIdOrEmpty: filename => filename ? schemaFilenameToId(filename) : '',
  },
});

const readmeTemplateSrcFilename = path.join(destDir, 'README.md.tpl');
const readmeTemplateSrc = fs.readFileSync(readmeTemplateSrcFilename, 'utf8');
const readmeCompiledTemplate = template(readmeTemplateSrc);
const readmeDestFilename = path.join(__dirname, '/../README.md');

const schemas = [];
const schemasByRef = {};

function renderTemplateForSchemaRef(data) {
  assert(data.ref, 'Requires property "ref"');
  assert(data.level, 'Requires property "level"');
  const schema = schemasByRef[data.ref];
  const opts = {
    schemaFilename: data.ref,
    level: data.level,
    schema,
  };
  return renderTemplateForSchema(opts);
}

function renderTemplateForSchema(data) {
  data.schemaFilename = data.schemaFilename || '';
  assert(data.level, 'Requires property "level"');
  assert(data.schema, 'Requires property "schema"');
  return compiledTemplate(data);
}

const spinner = ora();
try {
  spinner.start(`Reading ${srcPattern}...`);
  const srcPaths = glob.sync(srcPattern);
  spinner.info(`Found ${srcPaths.length} schemas in ${srcDir}`);
  srcPaths.forEach((srcFilename) => {
    const schema = yaml.safeLoad(fs.readFileSync(srcFilename, 'utf8'));
    const srcBaseName = path.basename(srcFilename);
    const destBasename = docFilename(srcBaseName);
    const meta = {
      srcBaseName,
      destBasename,
      schema,
      ref: srcBaseName,
      url: destBasename,
      id: schemaFilenameToId(srcBaseName),
      title: schema.title,
    };
    schemas.push(meta);
    schemasByRef[meta.ref] = meta;
  });

  schemas.forEach((schemaMeta) => {
    spinner.start(`Rendering template for "${schemaMeta.srcBaseName}"...`);
    const destName = path.join(destDir, schemaMeta.destBasename);

    const schemaFilename = schemaMeta.srcBaseName.replace(srcExt, destSchemaExt);
    const renderedTemplate = renderTemplateForSchema({
      schemaFilename,
      schema: schemaMeta.schema,
      level: 1,
    });
    fs.writeFileSync(destName, renderedTemplate);
    spinner.succeed(`Rendered template for "${schemaMeta.srcBaseName}" OK to ${destDir}`);
  });
  spinner.succeed(`Wrote ${srcPaths.length} file OK`);

  spinner.start('Rendering README.md...');
  const readmeRenderedTemplate = readmeCompiledTemplate({
    schemas,
  });
  fs.writeFileSync(readmeDestFilename, readmeRenderedTemplate);
  spinner.succeed('Rendered README.md OK.');

  spinner.stopAndPersist({
    symbol: '🏁',
    text: `Wrote all schema docs to ${destDir}`,
  });
} catch (err) {
  spinner.fail(err);
  /* eslint no-console: 0 */
  console.error(err);
}

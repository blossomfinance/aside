#!/usr/bin/env node

'use strict';

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
  },
});

const readmeTemplateSrcFilename = path.join(destDir, 'README.md.tpl');
const readmeTemplateSrc = fs.readFileSync(readmeTemplateSrcFilename, 'utf8');
const readmeCompiledTemplate = template(readmeTemplateSrc);
const readmeDestFilename = path.join(__dirname, '/../README.md');

function renderTemplateForSchema(schema, level) {
  return compiledTemplate({
    level,
    schema,
  });
}

const spinner = ora();
const schemas = [];
try {
  spinner.start(`Reading ${srcPattern}...`);
  const srcPaths = glob.sync(srcPattern);
  spinner.info(`Found ${srcPaths.length} schemas in ${srcDir}`);
  srcPaths.forEach((srcFilename) => {
    const schema = yaml.safeLoad(fs.readFileSync(srcFilename, 'utf8'));
    const srcBaseName = path.basename(srcFilename);
    spinner.start(`Rendering template for "${srcBaseName}"...`);
    const destBasename = docFilename(srcBaseName);
    const destName = path.join(destDir, destBasename);
    const renderedTemplate = renderTemplateForSchema(schema, 1);
    fs.writeFileSync(destName, renderedTemplate);
    spinner.succeed(`Rendered template for "${srcBaseName}" OK to ${destDir}`);
    schemas.push({
      id: schemaFilenameToId(srcBaseName),
      title: schema.title,
      url: destBasename,
    });
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

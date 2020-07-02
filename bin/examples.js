#!/usr/bin/env node

'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yaml = require('js-yaml');
const ora = require('ora');
const template = require('lodash.template');

const schemaFilenameToId = require('./../lib/schema-filename-to-id');

const srcDir = path.join(__dirname, '/../test/fixtures');
const srcExt = '.yml';
const srcPattern = `${srcDir}/*${srcExt}`;

const destDir = path.join(__dirname, '/../dist/examples');
const destExt = '.json';

const spinner = ora();
try {
  spinner.start(`Reading ${srcPattern}...`);
  const srcPaths = glob.sync(srcPattern);
  spinner.info(`Found ${srcPaths.length} examples in ${srcDir}`);
  srcPaths.forEach((srcFilename) => {
    const schema = yaml.safeLoad(fs.readFileSync(srcFilename, 'utf8'));
    const srcBasename = path.basename(srcFilename);
    const destBasename = srcBasename.replace(srcExt, destExt);
    const destName = path.join(destDir, destBasename);
    fs.writeFileSync(destName, JSON.stringify(schema, null, 2));
    spinner.succeed(`Rendered template for "${srcBasename}" OK to ${destDir}`);
  });
  spinner.succeed(`Wrote ${srcPaths.length} file OK`);

  spinner.stopAndPersist({
    symbol: '🏁',
    text: `Wrote all examples docs to ${destDir}`,
  });
} catch (err) {
  spinner.fail(err);
  /* eslint no-console: 0 */
  console.error(err);
}

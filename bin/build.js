#!/usr/bin/env node

'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yaml = require('js-yaml');
const ora = require('ora');

// const convertRefToJsonPointer = require('./../lib/convert-ref-to-json-pointer');
const convertRef = require('./../lib/convert-ref');
// const schemaFilenameToId = require('./../lib/schema-filename-to-id');

const srcDir = path.join(__dirname, '/../schemas');
const destDir = path.join(__dirname, '/../dist/schemas');

const srcExt = '.schema.yml';
const destExt = '.schema.json';

const srcPattern = `${srcDir}/*${srcExt}`;

const spinner = ora();
try {
  spinner.start(`Reading ${srcPattern}...`);
  const srcPaths = glob.sync(srcPattern);
  spinner.info(`Found ${srcPaths.length} files in ${srcDir}`);
  srcPaths.forEach((srcFilename) => {
    const srcBaseName = path.basename(srcFilename);
    spinner.start(`Converting "${srcBaseName}" from YML to JSON...`);
    const destBaseName = srcBaseName.replace(srcExt, destExt);
    const destName = path.join(destDir, destBaseName);
    const schema = yaml.safeLoad(fs.readFileSync(srcFilename, 'utf8'));
    convertRef(schema);
    const dest = JSON.stringify(schema, null, 2);
    fs.writeFileSync(destName, dest);
    spinner.succeed(`Processed "${srcBaseName}" OK to ${srcDir}`);
  });
  spinner.succeed(`Wrote ${srcPaths.length} file OK`);

  // const allDest = JSON.stringify(allSrc, null, 2);
  // fs.writeFileSync(allDestName, allDest);

  spinner.stopAndPersist({
    symbol: '🏁',
    text: `Wrote all schemas to ${destDir}`,
  });
} catch (err) {
  spinner.fail(err);
  /* eslint no-console: 0 */
  console.error(err);
}

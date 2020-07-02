#!/usr/bin/env node

// TODO: jsona-schema-faker seems totally broken

'use strict';

const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const util = require('util');

const loadSchemaFromFile = require('./../lib/load-schema-from-file');
const convertToInline = require('./../lib/convert-to-inline');

const srcDir = path.join(__dirname, '/../dist');
const destDir = path.join(__dirname, '/../test/fixtures');
const srcExt = '.schema.json';
const srcFilename = path.join(srcDir, `issuer${srcExt}`);
// const defsFilename = path.join(srcDir, `all${srcExt}`);
const destFilename = path.join(__dirname, 'examples.json');

const spinner = ora();

(async function () {
  try {
    // spinner.start(`Loading definitions ${defsFilename}`);
    // const srcDefs = await fs.readFile(defsFilename, 'utf8');
    // const defs = JSON.parse(srcDefs);
    // console.log(defs);
    const defsList = [];
    // const defsList = Object.keys(defs.definitions).map(key => {
    //   const def = defs.definitions[key];
    //   def.id = key;
    //   return def;
    // });
    // spinner.succeed(`Loaded definitions from ${defsFilename} OK`);
    // console.log(defsList);

    const schemaName = process.argv[1] || 'issuer';
    spinner.start(`Loading schema ${schemaName}...`);
    const schema = await loadSchemaFromFile('issuer', {
      srcExt,
      srcDir,
    });
    spinner.succeed(`Loaded schema ${schemaName}`);

    spinner.start('Resolving external schemas...');
    const inlineSchema = await convertToInline(schema, {
      srcExt,
      srcDir,
    });
    spinner.succeed('Resolved external schemas OK.');
    console.log(util.inspect(inlineSchema, {
      depth: null,
    }));

    spinner.start('Generating fixtures...');
    jsf.option('alwaysFakeOptionals', false);
    jsf.option('refDepthMax', 1);
    const values = jsf.generate(inlineSchema);
    const dest = JSON.stringify(values);
    fs.writeFileSync(dest, destFilename);
    spinner.succeed('Generated fixtures OK');
    console.log(util.inspect(dest, {
      depth: null,
    }));
  } catch (err) {
    spinner.fail(err);
    console.error(err);
  }
})();

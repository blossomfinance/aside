'use strict';

const path = require('path');
const ora = require('ora');

const validate = require('./../lib/validate');
const loadYamlFile = require('./../lib/load-yaml-file');

const fixturesPath = path.join(__dirname, 'fixtures');
const spinner = ora();

(async () => {
  try {
    spinner.start('Loading example...');
    const example = loadYamlFile(path.join(fixturesPath, 'bmt-dana-insani-1.yml'));
    spinner.succeed('Loaded example OK');

    spinner.start('Validating against schema...');
    await validate('securitization', example);
    spinner.succeed('Validated example OK');
  } catch (err) {
    /* eslint no-console: 0 */
    spinner.fail(err.message);
    console.error(err);
  }
})();

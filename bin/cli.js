#! /usr/bin/env node

'use strict';

const yargs = require('yargs');
const {analyze} = require('../lib');

const argv = yargs.argv;

analyze(argv._[0])
  .then(result => console.log(result));

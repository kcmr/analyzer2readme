'use strict';

const {generateAnalysis, FsUrlLoader, PackageUrlResolver, Analyzer} = require('polymer-analyzer');
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');
const root = process.cwd();

const initializeAnalyzer = async () => {
  const urlLoader = new FsUrlLoader(root);

  const urlResolver = new PackageUrlResolver({
    packageDir: root,
    componentDir: root
  });

  // TODO: moduleResolution (node | none)
  const analyzer = new Analyzer({
    urlLoader,
    urlResolver
  });

  return {urlLoader, urlResolver, analyzer};
};

const getInputsFromPkg = () => {
  const bowerPackage = 'bower.json';
  const npmPackage = 'package.json';

  const hasBower = fs.existsSync(bowerPackage);
  const pkgFile = hasBower ? bowerPackage : npmPackage;

  const pkg = require(path.join(root, pkgFile));
  const {main} = pkg;

  return Array.isArray(main) ? main : [main];
};

const parseAnalysis = analysis => {
  const {mixins, classes} = analysis;

  const result = [];
  const publicAndNotInherited = item => item.privacy === 'public' && !item.inheritedFrom;

  for (const mixin of mixins) {
    const publicProperties = mixin.properties.filter(publicAndNotInherited);
    const publicMethods = mixin.methods.filter(publicAndNotInherited);

    result.push({
      type: 'mixin',
      name: mixin.name,
      properties: publicProperties,
      methods: publicMethods,
      events: mixin.events
    });
  }

  console.log(result[0].methods);
  console.log(result[0].events);

  return result;
};

const generateReadme = contents => {
  nunjucks.configure(__dirname);

  function unquote(string) {
    if (!string) {
      return;
    }

    return string.replace(/\"/g, '');
  }

  nunjucks.render('README_TEMPLATE.md', {
    data: contents,
    unquote: unquote
  }, (error, result) => {
    if (error) {
      return console.log(error);
    }

    fs.writeFile(path.join(root, 'TEST.md'), result, error => {
      if (error) {
        return console.log(error);
      }

      console.log('archivo creado');
    });
  });
};

const analyze = async (inputs = getInputsFromPkg()) => {
  const {analyzer} = await initializeAnalyzer();

  inputs = Array.isArray(inputs) ? inputs : [inputs];
  const analysis = await analyzer.analyze(inputs);

  const parsedAnalysis = generateAnalysis(analysis, analyzer.urlResolver);
  const chachi = parseAnalysis(parsedAnalysis);
  generateReadme(chachi);

  return chachi;
};

module.exports = {
  analyze
};


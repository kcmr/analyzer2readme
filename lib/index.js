'use strict';

const {generateAnalysis, FsUrlLoader, PackageUrlResolver, Analyzer} = require('polymer-analyzer');
const fs = require('fs');
const path = require('path');
const root = process.cwd();

function convertModuleResolution(moduleResolution = 'none') {
  switch (moduleResolution) {
    case 'node':
      return 'node';
    case 'none':
      return undefined;
    default:
      throw new Error(`Unknown module resolution parameter ${moduleResolution}`);
  }
}

const initializeAnalyzer = async () => {
  const urlLoader = new FsUrlLoader(root);

  const urlResolver = new PackageUrlResolver({
    packageDir: root,
    componentDir: root
  });

  const analyzer = new Analyzer({
    urlLoader,
    urlResolver,
    moduleResolution: convertModuleResolution()
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

const analyze = async (inputs = getInputsFromPkg()) => {
  const {analyzer} = await initializeAnalyzer();

  inputs = Array.isArray(inputs) ? inputs : [inputs];
  const analysis = await analyzer.analyze(inputs);
  
  return generateAnalysis(analysis, analyzer.urlResolver);
};

module.exports = {
  analyze
};


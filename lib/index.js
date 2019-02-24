'use strict';

const {generateAnalysis, FsUrlLoader, PackageUrlResolver, Analyzer} = require('polymer-analyzer');
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

const analyze = async inputs => {
  const {analyzer} = await initializeAnalyzer();
  const analysis = await analyzer.analyze(inputs);
  return generateAnalysis(analysis, analyzer.urlResolver);
};

module.exports = {
  analyze
};


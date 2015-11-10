#!/usr/bin/env node

var fs = require('fs');
var walkSync = require('walk-sync');
var SourceMap = require('fast-sourcemap-concat');
var rimraf = require('rimraf');
var babel = require('babel');
var usedHelpers = [];

var s = new SourceMap({
  outputFile: 'dist/modules.js'
});

walkSync('modules')
  .filter(function(file) {
    return file.slice(-1) !== '/';
  })
  .forEach(function(file) {
    var moduleName = file.slice(0, -3);
    var content = fs.readFileSync('modules/' + file, { encoding: 'utf8' });

    var babelOutput = babel.transform(content, {
      filename: file,
      loose: true,
      moduleId: true,
      modules: 'amdStrict',
      externalHelpers: true,
      metadataUsedHelpers: true,
      optional: ["es7.decorators"]
    });

    usedHelpers = usedHelpers.concat(babelOutput.metadata.usedHelpers);

    var code = babelOutput.code;

    fs.writeFileSync('tmp-file.js', code, { encoding: 'utf8' });
    s.addFileSource(file, babelOutput.code);
    s.addSpace("\n");
  });

console.log('Helpers: ' + usedHelpers.join(', '));
// write the helpers to the file
s.addFileSource('babelHelpers.js', babel.buildExternalHelpers(usedHelpers));
s.addSpace("\n");

s.end();

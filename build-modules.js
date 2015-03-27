#!/usr/bin/env node

var fs = require('fs');
var esperanto = require('esperanto');
var walkSync = require('walk-sync');
var SourceMap = require('fast-sourcemap-concat');
var rimraf = require('rimraf');
var babel = require('babel');

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
 
    content = babel.transform(content).code;

    var code = esperanto.toAmd(content, {
      sourceMap: 'inline',
      sourceMapSource: file,
      sourceMapFile: 'dest.js.map',
      amdName: moduleName,
      strict: true,
      absolutePaths: true
    }).code

    fs.writeFileSync('tmp-file.js', code, { encoding: 'utf8' });
    s.addFileSource(file, code);
    s.addSpace("\n");
  });

s.end()

esperanto.bundle({
  base: 'modules', // optional, defaults to current dir
  entry: 'main.js' // the '.js' is optional
}).then( function ( bundle ) {
  var amd = bundle.toUmd({
    name: 'UmdTest',
    strict: true,
    absolutePaths: true,
    sourceMap: true,
    sourceMapFile: 'bundle.js'
  });
});
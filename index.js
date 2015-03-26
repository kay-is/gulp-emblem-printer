'use strict';
var compileEmblem = require('emblem').default.compile,
  gutil = require('gulp-util'),
  through = require('through2');

module.exports = function(options) {
  options = options || {};
  var extension = options.extension || '.hbs';

  return through.obj(function(file, encoding, finish) {
    if(file.isNull()) {
      return finish(null, file);
    }
    if(file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-emblem-printer', 'Streaming not supported'));
      return finish(null, file);
    }
    file.contents = new Buffer(compileEmblem(file.contents), encoding);
    file.path = gutil.replaceExtension(file.path, extension);
    return finish(null, file);
  });
};
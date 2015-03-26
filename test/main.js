var emblemPrinter = require('../');
var should = require('should');
var path = require('path');
var assert = require('stream-assert');
var testStream = require('./test-stream');
var File = require('gulp-util').File;
var gulp = require('gulp');
require('mocha');

var fixtures = function (glob) { return path.join(__dirname, 'fixtures', glob); }

describe('gulp-emblem-printer', function () {
  it('emits error on streamed file', function (done) {
    gulp.src(fixtures('*'), { buffer: false })
      .pipe(emblemPrinter())
      .on('error', function(err) { done(); });
  });

  it('converts small file', function (done) {
    testStream('h1 = test')
      .pipe(emblemPrinter())
      .pipe(assert.length(1))
      .pipe(assert.first(function (d) { d.contents.toString().should.eql('<h1>{{test}}</h1>'); }))
      .pipe(assert.end(done));
  });

  it('converts large file', function (done) {
    gulp.src(fixtures('*'), { buffer: true })
      .pipe(emblemPrinter())
      .pipe(assert.length(1))
      .pipe(assert.end(done));
  });

  it('converts multiple files', function (done) {
    testStream('h1 = test', 'a.mylink: img src="test.jpg"')
      .pipe(emblemPrinter())
      .pipe(assert.length(2))
      .pipe(assert.first(function (d) { d.contents.toString().should.eql('<h1>{{test}}</h1>'); }))
      .pipe(assert.second(function (d) { d.contents.toString().should.eql('<a class="mylink"><img src="test.jpg"></a>'); }))
      .pipe(assert.end(done));
  });

  it('preserves mode from files', function (done) {
    testStream('h1 = test', 'a.mylink: img src="test.jpg"')
      .pipe(emblemPrinter())
      .pipe(assert.length(2))
      .pipe(assert.first(function (d) { d.stat.mode.should.eql(0666); }))
      .pipe(assert.second(function (d) { d.stat.mode.should.eql(0666); }))
      .pipe(assert.end(done));
  });

  it('preserves relative path from files', function (done) {
    testStream('h1 = test', 'a.mylink: img src="test.jpg"')
      .pipe(emblemPrinter())
      .pipe(assert.length(2))
      .pipe(assert.first(function (d) { d.relative.should.eql('file0.hbs'); }))
      .pipe(assert.second(function (d) { d.relative.should.eql('file1.hbs'); }))
      .pipe(assert.end(done));
  });

  describe('options', function () {
    it('supports extension', function (done) {
      testStream('h1 = test', 'a.mylink: img src="test.jpg"')
        .pipe(emblemPrinter({extension: '.handlebars'}))
        .pipe(assert.length(2))
        .pipe(assert.first(function (d) { d.relative.should.eql('file0.handlebars'); }))
        .pipe(assert.second(function (d) { d.relative.should.eql('file1.handlebars'); }))
        .pipe(assert.end(done));
    });
  });
});
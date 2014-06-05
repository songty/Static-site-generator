// var chai = require('chai');
'use strict';

var expect = require('chai').expect;
var lib = require('../index');
var path = require('path');
var tmp = require('temp').track();

var fixtures =  function (fix) {
	return path.join(__dirname, 'fixtures', fix);
};

describe('fileReader()', function() {
	it('should read a file', function(done) {
		lib.fileReader(fixtures('text.txt'), function (err, contents) {
			expect(contents).to.be.eql('this is just some text');
			done();
		});
	});
});

describe('pathReader()', function() {
	it('shoud turn directory items into a number of arrays', function(done) {
		lib.pathReader(fixtures('source'), function(err, files) {
			expect(files.length).to.be.eql(2);
			done();
		});
	});
	it('should return the array', function(done) {
		lib.pathReader('test', function(err, files) {
			expect(files).to.be.eql(['fixtures', 'test.js']);
			done();
		});
	});
});

describe('isHtml()', function() {
	it('should return false for non-html files', function () {
		expect(lib.isHtml('blablab.hml')).to.be.eql(false);
	});
	it('should return true for html files', function() {
		expect(lib.isHtml('blah.html')).to.be.eql(true);
	});
});

describe('sourceTemplate()', function() {
	it('should return an array with two items from template', function(done) {
		lib.sourceTemplate(fixtures('source/layouts/testme!.html'), function(array) {
			expect(array).to.be.eql(['testme!\n', '\ntest!']);
			done();
		});
	});
});

describe('sourcePage()', function() {
	it('returns array of pages that needs be beautified', function(done) {
		lib.sourcePage(fixtures('source/pages'), function(pages) {
			expect(pages).to.be.eql(['about.html', 'home.html']);
			done();
		});
	});
});


describe('fileWriter()', function() {
	it('creates a new file in generated directory', function(done) {
		lib.fileWriter(fixtures('testcase'), 'hello world', function() {
			lib.fileReader(fixtures('testcase'), function(err, contents) {
				expect(contents).to.be.eql('hello world');
				done();
			});
		});
	});
});

describe('fileShreader()', function() {
	it('deletes files inside a directory', function(done) {
		tmp.mkdir('generated', function(err, dirPath) {
			if (err) { throw err; }
			lib.fileShreader(function() {
				lib.pathReader(dirPath, function(err, files) {
					expect(files.length).to.be.eql(0);
					done();
				});
			});
		});		
	});
});

describe('generator()', function() {
	it('creates files from template with source pages', function(done) {
		// tmp.mkdir('new', function(err, dirPath) {
			lib.generator(function() {
				lib.pathReader(fixtures('generated'), function(err, files) {
					// console.log(fixtures('source'));
					lib.pathReader(fixtures('source'), function(err, source) {
						expect(files.length).to.be.eql(source.length);
						done();
					});
				});
			});
		// });
	});
});

var fs = require('fs');
var options = { encoding: 'utf8' };
var path = require('path');

var fileReader = module.exports.fileReader = function (textFile, cb) {
	fs.readFile(textFile, options, function(err, contents) {
		cb(null, contents);
	});
};

/**
 * Reads files at a path
 *
 * @function
 * @param {string} ipath - The path at which to read
 * @param {function} cb - The callback to call. The callback receives two
 * arguments, `err`, an error, and `files`, an array of file names.
 */
var pathReader = module.exports.pathReader = function (ipath, cb) {
	fs.readdir(ipath, function(err, files) {
		cb(null, files);
	});
};

//Makes a new file in the generated directory
var fileWriter = module.exports.fileWriter = function (newFile, contents) {
	fs.writeFile(newFile, contents, options, function (err) {
		if (err) throw err;
  	});
};

//Deletes all the files in the generated director
var fileShreader  = module.exports.fileShreader = function (cb) {
	var targetDir = path.join(__dirname, 'generated');
	pathReader('generated', function(err, files) {
		files.forEach(function(element) {
			var targetFile = path.join(targetDir, element);
			fs.unlink(targetFile);
		});
		cb();
	});
};

var isHtml = module.exports.isHtml = function(ifile) {
	return ifile.search('html') !== -1;
};

/**
 * Reading the contents of the source pages
 *
 * @function
 * @param {function} cb - The callback to call. The callback receives one
 * argument, `pages`, an array of html page file names.
 */
var sourcePage = module.exports.sourcePage = function(path, cb) {
	pathReader(path, function(err, files) {
		var filtered = files.filter(isHtml);
		cb(filtered);
	});
};

//Splits the default template into two parts on {{ content }}
var sourceTemplate = module.exports.sourceTemplate = function(path, cb) {
	fileReader(path, function(err, contents) {
		if (contents.search("{{ content }}") !== -1) {
			var defaultTemplate = contents.split("{{ content }}");
			cb(defaultTemplate);
		}
	});
};
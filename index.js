var fs = require('fs');
var options = { encoding: 'utf8' };
var path = require('path');

/**
 * Reads files at a path
 *
 * @function
 * @param {string} ipath - The path at which to read
 * @param {function} cb - The callback to call. The callback receives two
 * arguments, `err`, an error, and `contents`, the contents of path file.
 */
var fileReader = module.exports.fileReader = function (textFile, cb) {
	fs.readFile(textFile, options, function(err, contents) {
		if (err) { return cb(err); }
		cb(null, contents);
	});
};

/**
 * Reads path to a file
 *
 * @function
 * @param {string} ipath - The path at which to read
 * @param {function} cb - The callback to call. The callback receives two
 * arguments, `err`, an error, and `files`, an array of file names.
 */
var pathReader = module.exports.pathReader = function (ipath, cb) {
	fs.readdir(ipath, function(err, files) {
		if (err) { return cb(err); }
		cb(null, files);
	});
};

/**
 * Writes files at a path
 *
 * @function
 * @param {string} newFile - The path at which to write
 * @param {function} contents - The contents be written.
 * @param {function} cb - The call back of this function return nothing.
 */
var fileWriter = module.exports.fileWriter = function (newFile, contents, cb) {
	fs.writeFile(newFile, contents, options, function (err) {
		if (err) throw err;
		cb();
  	});
};

/**
 * Deltes all files in the generated directory
 *
 * @function
 * @param {function} cb - The call back to shreader.
 */
var fileShreader  = module.exports.fileShreader = function (cb) {
	var targetDir = path.join(__dirname, 'test/fixtures/generated');
	pathReader(targetDir, function(err, files) {
		if (err) { return cb(err); }
		var counter = 0;
		if (counter === files.length) {cb();}
		files.forEach(function(element) {
			var targetFile = path.join(targetDir, element);
			fs.unlink(targetFile, function(err) {
				// TODO: handle errors
				counter += 1;
				if (counter === files.length) {cb();} 	
			});
		});
	});
};

/**
 * Check if the string contains html
 *
 * @function
 * @param {string} ifile - return true if ifile is html.
 */
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
		if (err) { return cb(err); }		
		var filtered = files.filter(isHtml);
		cb(filtered);
	});
};


/**
 * Reading the contents of the template pages
 * Splits the default template into two parts on {{ content }}
 *
 * @function
 * @param {string} path - The path of the source template.
 * @param {function} cb - The callback to call. The callback receives one
 * argument, `temp`, an array with two elemnts with contents split in half.
 */
var sourceTemplate = module.exports.sourceTemplate = function(path, cb) {
	fileReader(path, function(err, contents) {
		if (err) { return cb(err); }		
		if (contents.search("{{ content }}") !== -1) {
			var defaultTemplate = contents.split("{{ content }}");
			cb(defaultTemplate);
		}
	});
};

/**
 * Generates files using a default template
 * TODO: make function take arguments for template and page path.
 *
 * @function
 * @param {function} cb - The callback to call
 */
var generator = module.exports.generator = function (cb) {
	fileShreader(function() {
		var mP = __dirname;
		var tempPath = path.join(mP, 'test/fixtures/source/layouts/default.html');
		var pagePath = path.join(mP, 'test/fixtures/source/pages');
		sourceTemplate(tempPath, function(temp) {
			sourcePage(pagePath, function(pages) {
				var counter = 0;
				if (counter === pages.length) {cb();}
				pages.forEach(function(eachPage) {
					fileReader(path.join(pagePath, eachPage), function(err, contents) {
						if (err) throw err;
						var resultArray = temp[0].concat(contents, temp[1]);
						// console.log(resultArray);
						var writePath = path.join(mP, 'test/fixtures/generated', eachPage);
						fileWriter(writePath, resultArray, function(err){});
						//TODO: Errors handling
						counter +=1;
						if (counter === pages.length) {cb();}
					});
				});

			});
		});
	}); 
};
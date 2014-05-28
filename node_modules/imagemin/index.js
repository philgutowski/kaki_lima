/**
 * 代码修改自grunt-img
 */
'use strict';
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var spawn = child_process.spawn;
//非系统模块
var which = require('which');
var log = require('./lib/log');
var pngcrush = require('node-pngcrush');

var emptyFn = function() {};

var win32 = process.platform === 'win32';
var png = ['.png', '.bmp', '.gif', '.pnm', '.tiff'],
    jpegs = ['.jpg', 'jpeg'];
var imagemin = module.exports = function(dir, destDir, cb) {
    destDir = destDir || '';
    if (typeof destDir === 'function') {
        cb = destDir;
    }
    if (typeof cb !== 'function') {
        cb = emptyFn;
    }


    var files = [];
    if (Array.isArray(dir)) {
        dir.forEach(function(v) {
            imagemin(v, destDir, cb);
        });
        return;
    }

    if (fs.statSync(dir).isDirectory()) {
        //遍历目录
        recurse(dir, function(filepath, rootdir, subdir, filename) {
            files.push(filepath);
        });
    } else {
        //是文件
        files.push(dir);
    }

    var pngfiles = files.filter(function(file) {
        return !!~png.indexOf(path.extname(file).toLowerCase());
    });

    var jpgfiles = files.filter(function(file) {
        return !!~jpegs.indexOf(path.extname(file).toLowerCase());
    });


    log.writeln('Running imagemin task... ');
    pngc(pngfiles, destDir, function() {
        jpegtran(jpgfiles, {}, destDir, function(err) {
            if (err) {
                log.error(err);
            }
            cb();
        });
    });
};

function pngc(files, output, cb) {
    cb = cb || emptyFn;
    if (!files.length) {
        return cb();
    }

    
    var isOutDir = false;
    if (output) {
        var ext = path.extname(output).toLowerCase();
        if ( !! ~png.indexOf(ext)) {
            //文件

        } else {
            if (!/\/$/.test(output)) {
                output += path.sep;
            }

            if (!fs.existsSync(output)) {
                output = '';
            }
            //目录
            isOutDir = true;
        }
    }
    var file;
    while (file = files.shift()) {
        var data = fs.readFileSync(file);
        var buffer = pngcrush.compress(data);
        log.writeln('*Processing: '.cyan + path.normalize(file));
        var outfile = file;
        var min = file,
            max = file;
        if (output !== '') {
            outfile = isOutDir ? output + path.basename(file) : output;
            min = outfile;
        } else {
            min = {
                size: buffer.length
            };
            max = {
                size: data.length
            };
        }
        log.writeln('Output file: '.cyan + path.normalize(outfile));
        fs.writeFileSync(outfile, buffer, {
            flags: 'wb'
        });
        min_max_stat(min, max);
    }
    cb();
}

function jpegtran(files, opts, output, cb) {
    opts = opts || {};
    cb = cb || function() {};
    opts.args = opts.args ? opts.args : ['-copy', 'none', '-optimize', '-outfile', 'jpgtmp.jpg'];

    which_bin('jpegtran', function(err, cmdpath) {
        if (err) return not_installed('jpegtran', cb);
        (function run(file) {
            if (!file) return cb();

            log.writeln('*Processing: '.cyan + path.normalize(file));

            var jpegtran = spawn(cmdpath, opts.args.concat(file), function() {});

            var outputPath;
            if (output) {
                var ext = path.extname(output).toLowerCase();
                if ( !! ~jpegs.indexOf(ext)) {
                    //文件
                    outputPath = output;
                } else {
                    if (!/\/$/.test(output)) {
                        output += path.sep;
                    }
                    outputPath = output + path.basename(file);
                }

                try {
                    fs.readFileSync(outputPath);
                } catch (err) {
                    fs.writeFileSync(outputPath);
                }
                log.writeln('Output file: '.cyan + path.normalize(outputPath));
            } else {
                outputPath = file;
            }

            jpegtran.stdout.pipe(process.stdout);
            jpegtran.stderr.pipe(process.stderr);

            jpegtran.on('exit', function(code) {
                if (code) return log.warn('jpgtran exited unexpectedly with exit code ' + code);
                // output some size info about the file
                min_max_stat('jpgtmp.jpg', file);
                // copy the temporary optimized jpg to original file
                fs.createReadStream('jpgtmp.jpg')
                    .pipe(fs.createWriteStream(outputPath)).on('close', function() {
                        //删除
                        fs.unlinkSync('jpgtmp.jpg');
                        run(files.shift());
                    });
            });
        }(files.shift()));
    });
};


// Output some size info about a file, from a stat object.

function min_max_stat(min, max) {
    min = typeof min === 'string' ? fs.statSync(min) : min;
    max = typeof max === 'string' ? fs.statSync(max) : max;
    log.writeln('Uncompressed size: ' + String(max.size).green + ' bytes.');
    log.writeln('Compressed size: ' + String(min.size).green + ' bytes (' + String(max.size - min.size).green + ' bytes = ' + (String((max.size - min.size) / max.size * 100).slice(0, 5) + '%').green + ' decrease).');

};

function not_installed(cmd, cb) {
    log.log('[Running ' + cmd + '...](error)');

    log.writeln([
        'In order for this task to work properly, :cmd must be',
        'installed and in the system PATH (if you can run ":cmd" at',
        'the command line, this task should work)'
    ].join(' ').replace(/:cmd/g, cmd));
    log.writeln('Skiping ' + cmd + ' task');
    if (cb) cb();
};

var unixifyPath = function(filepath) {
    if (win32) {
        return filepath.replace(/\\/g, '/');
    } else {
        return filepath;
    }
};

/**
 * 遍历
 * @param  {[type]}   rootdir       [description]
 * @param  {Function} callback      [description]
 * @param  {[type]}   subdir        [description]
 * @param  {[type]}   judgeFunction [description]
 * @return {[type]}                 [description]
 */

function recurse(rootdir, callback, subdir, judgeFunction) {
    var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
    subdir = subdir || '';
    judgeFunction = typeof judgeFunction === 'function' ? judgeFunction : function() {
        return true;
    };
    fs.readdirSync(abspath).forEach(function(filename) {
        var filepath = path.join(abspath, filename);
        if (fs.statSync(filepath).isDirectory() && judgeFunction(filename)) {
            recurse(rootdir, callback, unixifyPath(path.join(subdir, filename)), judgeFunction);
        } else {
            judgeFunction(filename) && callback(unixifyPath(filepath), rootdir, subdir, filename, judgeFunction);
        }
    });

}

// **which** helper, wrapper to isaacs/which package plus some fallback logic
// specifically for the win32 binaries in vendor/ (optipng.exe, jpegtran.exe)

function which_bin(cmd, cb) {
    if (!win32 || !/optipng|jpegtran/.test(cmd)) return which(cmd, cb);

    var jpegtran = './vendor/jpegtran-turbo/win32/jpegtran.exe';

    if (process.arch === 'x64') {
        jpegtran = './vendor/jpegtran-turbo/win64/jpegtran.exe';
    }

    var cmdpath = cmd === 'optipng' ? './vendor/optipng-0.7.4-win32/optipng.exe' :
        jpegtran;

    cb(null, path.join(__dirname, cmdpath));
};
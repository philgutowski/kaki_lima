imagemin
=============

A tool which fork from [grunt-img][grunt-img] to optimize PNG and JPG images with [pngcrush][node-pngcrush] & [jpegtran][jpegtran] ([jpegtran-turbo][jpegtran-turbo] on win32).

## Getting Started

First, be sure that you have [jpegtran][jpegtran] installed in your system.

### for Mac users
You can install with [homebrew][homebrew]
```shell
brew install jpeg
```

### for Linux users
Debian, Ubuntu and Mint
```shell
apt-get install libjpeg libjpeg-progs
```
Both libraries are easy to find for RPM distributions too.

### for Windows users
Don't worry because both libraries are included.

### Install
```shell
npm install imagemin
```

## How to use

### for shell
```shell
imagemin file/path
imagemin file/path -o new/file/path
```
### for nodejs
```js
var imagemin = require('imagemin');
imagemin(filePath, destDir, callback);
```

Credits
---------------
* Grunt-image [Helder Santana](http://heldr.com)
* node-pngcrush [node-pngcrush](https://github.com/xiangshouding/node-pngcrush)

[node-build-script]: http://github.com/h5bp/node-build-script
[grunt-img]: https://github.com/heldr/grunt-img
[jpegtran]: http://jpegclub.org/jpegtran/
[jpegtran-turbo]: http://libjpeg-turbo.virtualgl.org/
[node-pngcrush]: https://github.com/xiangshouding/node-pngcrush
[homebrew]: http://mxcl.github.com/homebrew/
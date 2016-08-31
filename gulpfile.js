/**
 *! frontman 手脚架
 * (c) frontui team
 */

var config = require('./config.json')
var pkg    = require('./package.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()
var Lib = require('./lib')

// 服务启动根目录
var serverRoot = __dirname

/*-------------
*  默认任务
-------------*/
require('./task/defaultTask')(serverRoot);

/*--------
*  更新 UI库 任务
------------- */
require('./task/updateTask')()

/*--------
*  合并 sprite 任务
------------- */
// preload: npm install gulp.spritesmith imagemin-pngquant merge-stream --save
// require('./task/spriteTask')()


/*-------------
*  svn任务
-------------*/
// require('./task/svnTask')(Lib.banner);

/*--------
*  tfs任务
------------- */
// preload: npm install gulp-tfs-fp --save-dev
// require('./task/tfsTask')()

/*--------
*  doc说明文档
------------- */
// require('./task/docTask')(config.docs)

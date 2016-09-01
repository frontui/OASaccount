/**
 * 生成环境，更新到TFS
 * 需要开启SVN任务
 *
 * npm install gulp-tfs-fp --save-dev
 * 
 * by tommyshao
 */
var config = require('../config.json')
var pkg    = require('../package.json')
var svn    = require('../svn.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')


var TFS    = require('gulp-tfs-fp')

var program = require('commander')
program.version('0.0.1')
		.option('-m, --message', 'add message')
		.parse(process.argv)


module.exports = function svnTask(banner) {
  gulp.task('tfs:checkout', ['svnServer'], function() {
    return gulp.src(svn.path)
            .pipe(TFS.checkout())
  })

  gulp.task('tfs', ['tfs:checkout'], function() {
    return gulp.src(svn.path)
                .pipe(TFS.checkin(program.args[1] || 'auto update by frontman'))
  })
}

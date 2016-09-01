/**
 * 更新less mixin
 * 
 * by tommyshao
 */

var gulp   = require('gulp')
var clean  = require('del')
var $      = require('gulp-load-plugins')()

module.exports = function() {
    //-- 首次下载
    gulp.task('cleanMixin', function(cb) {
        clean(['./static/less/BrickPlus-Mixin'], cb)
    })

    gulp.task('mixin', ['cleanMixin'], function(cb) {
        $.git.clone('https://github.com/frontui/BrickPlus-Mixin.git', {args: './static/less/BrickPlus-Mixin'}, cb)
    })
}

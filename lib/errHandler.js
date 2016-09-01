var gulp = require('gulp')
var $    = require('gulp-load-plugins')()

function errHandler( e ) {
  $.util.beep()
  $.util.log($.util.colors.red('↓看这里看这里，报错了：'))
  $.util.log(e)

  // 修复less中断不执行
  return this
}

module.exports = errHandler

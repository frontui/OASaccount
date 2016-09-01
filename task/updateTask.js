//  更新 UI 库
//  1. bower update
//  2. 执行拷贝
//
//  npm install gulp-bower --save
// 
//  by tommyshao

var gulp = require('gulp');
var config = require('../config.json')
var pkg    = require('../package.json')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()

module.exports = function updateTask() {
  //-- 更新frontui
  gulp.task('bower', function(){
    return $.bower({cmd: 'update'})
  });
  
  gulp.task('frontui', ['bower'], function() {
      return gulp.src('./bower_components/frontui/{iconfont,iconfont-ie7,images,js,less}/**/**')
      .pipe(gulp.dest(config.staticPath));
  });
}

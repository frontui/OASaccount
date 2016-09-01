/**
 * 生成开发文档
 *
 * by tommyshao
 */
var config = require('../config.json')
var pkg    = require('../package.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()

var browserSync = require('browser-sync').create()
var reload = browserSync.reload

var Lib    = require('../lib');
var srcUrl = path.join(__dirname, '..', config.docs.srcPath);
var destUrl = path.join(__dirname, '..', config.docs.destPath);
var templateUrl = path.join(srcUrl, config.docs.template)
var marked = Lib.marked(templateUrl, srcUrl);
//var marked = require('gulp-marked')



module.exports = function docTask() {
  gulp.task('docsTemplate', function() {
    //if(!config || !config.docs) return null;
    return gulp.src(srcUrl+'/**/**.md')
            .pipe(marked())
            .pipe($.rename({
              extname: '.html'
            }))
            .pipe($.prettify({indent_size: 2}))
            .pipe(gulp.dest(destUrl))
            .pipe(reload({ stream: true }))
  });

  gulp.task('docsStatic', function() {
    return gulp.src([srcUrl+'/**/**', '!'+srcUrl+'/**/**.md'])
                .pipe(gulp.dest(destUrl))
  })

  gulp.task('docsWatch', function(){
    return gulp.watch(srcUrl+'/**/**.md', ['docsTemplate'])
  })

  // 启动服务
  gulp.task('docsServer', function(){

      browserSync.init({
          // 界面管理工具
          ui: false,
          server: {
              // 目录都作为根目录访问
              baseDir: destUrl,
              directory: true,
          },
          port: config.docs.port,
          // 使用浏览器打开
          // 可以自定义配置
        //   browser: ['google chrome', 'firefox', 'Internet Explore']
          // 只启动 chrome 开发
          browser: ['google chrome']
      })
  })

  gulp.task('docs', ['docsTemplate', 'docsStatic', 'docsWatch', 'docsServer'])
}

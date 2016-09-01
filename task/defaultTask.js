/*!
*  默认任务
*  1. 模板编译 nunjucks
*  2. less 编译
*  3. livereload 自动刷新
*  4. connect http服务
*
* by tommyshao
*/
var gulp = require('gulp');
var config = require('../config.json')
var pkg    = require('../package.json')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()

// http server
var browserSync = require('browser-sync').create()
var reload = browserSync.reload

// http proxy 
var httpProxy = require('http-proxy-middleware')

var Lib        = require('../lib')
var template   = Lib.template(config.template)

var del = require('del')


module.exports = function defaultTask(serverRoot) {

  // 清除旧模板
  gulp.task('template:clean', function(cb) {
      del([config.destPath], cb)
  })

  // 模板
  gulp.task('template', ['template:clean'], function(){
  	return gulp.src([config.template + '/**/**.html', '!'+ config.template + '/**/_**.html', '!'+ config.template +'/_**/*.html'])
                  .pipe(template(config))
                  .pipe($.prettify({indent_size: 2}))
                  .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
                  .pipe(gulp.dest(config.destPath))
                  .pipe(reload({ stream: true }))
  });

  // less
  // autoprefix
  //    browsers:
  //      'last 2 versions',
  //      'ie6-8',
  //      'iOS 7',
  //      'not ie <= 8'
  //      etc...
  gulp.task('less', function(){
      return gulp.src([config.staticPath+'/less/**.less', '!'+ config.staticPath +'/_**/**', '!'+ config.staticPath + '/**/_*.less'])
                  .pipe($.sourcemaps.init())
                  .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
                  .pipe($.less())
                  .pipe($.autoprefixer('last 2 version', 'not ie <= 8'))
                  .pipe($.sourcemaps.write(config.staticPath+'/css'))
                  .pipe(gulp.dest(config.staticPath+'/css'))
                  .pipe(reload({ stream: true }))
  })

  // 启动服务
  gulp.task('server', function(){

      // 启用代理，将 js 中的 ajax 路径代理到 mock 服务器
      // 代理所有以`/api/`开头的请求
      var jsonProxy = httpProxy('/api/', {
          target: 'http://192.168.8.160:20160',  // mock 服务器
          changeOrigin: true,
          pathRewrite: {
              '/api': ''
          },
          logLevel: 'debug'
      })

      // 启动 http
      browserSync.init({
          // 界面管理工具
          ui: {
              port: 8080,
              weinre: { // weinre工具移动设备代理端口
                  port: 9090
              }
          },
          server: {
              // 目录都作为根目录访问
              baseDir: ['./www', './static'],
              directory: true,
              routes: {
                  '/bower_components': './bower_components'
              }
          },
          //proxy: 'http://192.168.8.160:20160',
          host: Lib.getIPAdress(),
          port: config.port,
          // 使用浏览器打开
          // 可以自定义配置
        //   browser: ['google chrome', 'firefox', 'Internet Explore']
          // 只启动 chrome 开发
          browser: ['google chrome'],
          // 管理代理
          middleware: [jsonProxy]
      })

  })

  //-- 文件监听

  gulp.task('watch', function(){
      gulp.watch(config.template + '/**/**.html', ['template'])
      gulp.watch(config.staticPath + '/less/**/**', ['less'])
      gulp.watch(config.staticPath + '/js/**/**').on('change', browserSync.reload)
      gulp.watch(config.staticPath + '/images/**/**').on('change', browserSync.reload)
  })


  /**
   * 默认任务
   * template, less, watch
   */
  gulp.task('default', function(cb){
      //gulp.start(['template', 'less', 'server', 'watch'])
      // gulp 4.0直接支持顺序任务
      $.sequence(['template', 'less'], 'server', 'watch')(cb)
  })
}

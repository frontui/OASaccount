/**
 * 生成环境，更新到SVN
 *
 *  by tommyshao
 */
var config = require('../config.json')
var pkg    = require('../package.json')
var svn    = require('../svn.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()

var browserSync = require('browser-sync').create()
var reload = browserSync.reload

// http proxy 
var httpProxy = require('http-proxy-middleware')

var Lib    = require('../lib')
var del    = require('del')

module.exports = function svnTask(banner) {
  // 临时文件夹
  var tmpPath = './tmp';

  // 模板
  gulp.task('svnTemplate', ['template'], function(){
      return gulp.src(['./'+ config.destPath + '/**/**.html'])
              .pipe($.prettify({indent_size: 2}))
              //.pipe($.changed(svn.path))
              .pipe($.replace(/\/static/g, './static'))
              //.pipe($.replace(/"(\/)bower_components\/(.[^\s]*)\/([a-zA-Z0-9.\-]+\.js)(.*)"/g, '"'+ config.staticPath +'/js/$3$4"'))
              .pipe($.replace(/"(js|css|images|fonts)\//g, '"./static/$1/'))
              // 将 bower_component重新定位到./static目录
              .pipe($.replace(/(\/)(bower_components)\//g, './static/js/$2/'))
              .pipe($.replace(/\/mock_data/g, './mock_data'))
              .pipe(gulp.dest(tmpPath))
  });

  // 拷贝
  gulp.task('svnCopy', function(){
      return gulp.src([config.staticPath + '/iconfont/**/**', config.staticPath + '/iconfont-ie7/**/**'], {base: 'client'})
          //.pipe($.changed(svn.staticPath))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  // css
  gulp.task('svnCss', function(){
      return gulp.src([config.staticPath+'/css/**/**.css'], {base: 'client'})
          .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          //.pipe($.changed(svn.staticPath))
          .pipe($.cleanCss({compatibility: 'ie8'}))
          .pipe($.header(banner, { pkg: pkg}))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
          .pipe($.size({showFiles: true, title: 'minified'}))
          .pipe($.size({showFiles: true, gzip: true, title: 'gzipped'}))
  })

  gulp.task('svnJs:copy', function() {
    return gulp.src([config.staticPath+'/js/**/**', !config.staticPath+'/js/**/**.js'], {base: 'client'})
        .pipe(gulp.dest(tmpPath + svn.staticPath))
  });

  // js
  gulp.task('svnJs', ['svnJs:copy'], function(){
      return gulp.src([config.staticPath+'/js/**/**.js'], {base: 'client'})
            .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          // require.config
        //   .pipe($.replace(/'(\/)bower_components\/(.[^\s]*)\/([0-9a-zA-Z\.-]*)'/g, '\'$3\''))
          .pipe($.replace(/(\/)(bower_components)(\/)/g, '$2$3'))
          //.pipe($.changed(svn.staticPath))
          .pipe($.uglify({mangle: false}))
          .pipe($.header(banner, { pkg: pkg}))
          .pipe(gulp.dest(tmpPath + svn.staticPath))
          .pipe($.size({showFiles: true, title: 'minified'}))
          .pipe($.size({showFiles: true, gzip: true, title: 'gzipped'}))
  })

  gulp.task('svnBowerJs', function(){
      return gulp.src(config.bower_source)
              .pipe(gulp.dest(tmpPath + svn.staticPath + '/js'))
  })

  // 拷贝 bower 包到./static目录 
  gulp.task('svnBower', function() {
      return gulp.src(config.bower_components.slice(1)+'/**/**')
                .pipe(gulp.dest(tmpPath + svn.staticPath + '/js' + config.bower_components))
  })

  // images
  gulp.task('svnImage', function(){
      return gulp.src([config.staticPath+'/images/**/**', '!'+config.staticPath+'/images/sprite/sprite-**/', '!'+config.staticPath+'/images/sprite/sprite-**/**/**'])
          .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
          //.pipe($.changed(svn.staticPath))
          // 启用压缩要先安装gulp-imagemin，时间比较长
          // npm install gulp-imagemin --save
          .pipe($.imagemin({
                     optimizationLevel: 5,
                     progressive: true,
                     svgoPlugins: [{removeViewBox: false}],
                     //use: [pngquant()]
                 })
          )
          .pipe(gulp.dest(tmpPath + svn.staticPath+'/images'))
  })

  gulp.task('svnDoc', function() {
    return gulp.src([config.docs.destPath+'/**/**', '!'+config.docs.destPath+'/template/**'])
                .pipe(gulp.dest(svn.path+'/docs'))
  });


  gulp.task('bundle', function() {
    return gulp.src(tmpPath+'/**/**')
              .pipe(gulp.dest(svn.path))
  })

  gulp.task('svnServer', function(cb){
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

     browserSync.init({
          // 界面管理工具
          ui: {
              port: 8081,
              weinre: { // weinre工具移动设备代理端口
                  port: 9091
              }
          },
          server: {
              // 目录都作为根目录访问
              baseDir: svn.path,
              directory: true
          },
          host: Lib.getIPAdress(),
          port: svn.port,
          // 使用浏览器打开
          // 可以自定义配置
        //   browser: ['google chrome', 'firefox', 'Internet Explore']
          // 只启动 chrome 开发
          browser: ['google chrome'],
          // 管理代理
          middleware: [jsonProxy]
      })

      cb()
  })

  // 清除生成目录
  gulp.task('clean:dist', function(cb) {
      del([svn.path], cb)
  })

  // 清楚临时文件
  gulp.task('clean:tmp', function(cb) {
      // 删除临时文件夹
      del([tmpPath, tmpPath+'/**/**'], cb);
  })

  gulp.task('build', function(cb){
      $.sequence(
          [ 'svnCopy', 'svnCss', 'svnJs', 'svnImage', 'svnBower', 'svnTemplate', 'svnDoc'], // 先构建，生成到临时文件夹 temp
          'clean:dist',  // 清除之前发布内容
          'bundle',      // 拷贝temp 内容到发布目录
          'svnServer',   // 启动服务人工检查对比页面
          'clean:tmp'    // 清除临时文件夹
      )(cb)
  });


  // 使用 zip 生成压缩包文件
  gulp.task('build:zip', ['build'], function() {
    return gulp.src(tmpPath+'/**/**')
            .pipe($.zip(pkg.name+'.zip'))
            .pipe(gulp.dest(tmpPath))
  });
}

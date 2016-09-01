/*!
*  第三方框架
*
*  更新日志
*  config.json给任务项增加 `newVer`，新版第三方框架
* 
* by tommyshao
*/

var config = require('../config.json')
var pkg    = require('../package.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()
var connect = $.connect

var Lib        = require('../lib')
var errHandler = Lib.errHandler
var template   = Lib.template(config.template);

var del = require('del')


module.exports = function defaultTask(serverRoot, banner) {

  /*-------------------
  * 第三方框架
  ---------------- */
  // 模板路径
  var thirdPart = path.join(serverRoot, config.template, '_thirdPart');
  // 模板目标路径
  var thirdPartDist = path.join(serverRoot, '_thirdPart');
  // 第三方静态文件目录
  var thirdStatic = path.join(serverRoot, 'static', 'thirdPart');
  var thirdSvnPath = svn.path+'/thirdPart';


  /* 多任务处理函数 */
  var frameworkTask = function(Settings, debug) {
    var tpls = Settings.template;
    var distPath = path.join(thirdPartDist, Settings.name);

    // 要处理的模板，拼接绝对的本地路径
    var templates = [].concat.apply([], tpls);
    templates = templates.map(function(tpl){
      return config.template + tpl;
    });

    // 所有处理模板，使用给第三方框架
    gulp.task('third:updateTemplate', function(next){
        return gulp.src(templates)
          .pipe($.replace(/wrapper\.html/g, 'third.html'))
          .pipe($.replace(/casher-frame\.html/g, 'third.html'))
          .pipe(gulp.dest(thirdPart))
    });

    // 处理一般页面，有左侧栏
    gulp.task('third:buildTemplate', ['third:updateTemplate'], function(){
      if(tpls[0]){ // 数组第一项
        var tmpls = tpls[0].map(function(file){
          return path.join(thirdPart , file);
        });
        var data = Settings;
        data.sidebar = true;
        // tpl(配置,是否有侧边栏)
        return gulp.src(tmpls)
          .pipe(template(data, config))
          .pipe(gulp.dest(distPath))
      }
    });

    // 处理没有侧边栏页面,比如收银台
    gulp.task('third:buildTemplate-noSide', ['third:buildTemplate'], function(){
      if(tpls[1]){ // 数组第二项
        var tmpls = tpls[1].map(function(file){
          return path.join(thirdPart , file);
        });
        var data = Settings;
        data.sidebar = false;

        return gulp.src(tmpls)
          .pipe(template(data, config))
          .pipe(gulp.dest(distPath))
      }
    });

    // 编译第三方框架less
    gulp.task('third:less', function(){
      return gulp.src([thirdStatic+'/less/**/**.less', '!'+ thirdStatic +'/_**/**', '!'+ thirdStatic + '/**/_*.less'])
        .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(thirdStatic+'/css'))
    })

    // ------
    // 更新到svn
    gulp.task('third:svnCss', ['third:less'], function(next) {
        return gulp.src(thirdStatic+'/css/**/**.css', {base: 'client'})
                  .pipe($.minifyCss({compatibility: 'ie7'}))
                  .pipe($.header(banner, { pkg: pkg}))
                  .pipe(gulp.dest(thirdSvnPath));
    });

    gulp.task('third:svnJs',  function(next) {
      return gulp.src(thirdStatic+'/js/**/**.js', {base: 'client'})
        .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
        //.pipe($.uglify({mangle: false}))
        .pipe($.uglify())
        .pipe($.header(banner, { pkg: pkg}))
        .pipe(gulp.dest(thirdSvnPath));
    });

    gulp.task('third:svnTemplate', ['third:buildTemplate-noSide'],  function(next) {
      return gulp.src(distPath+'/**/**.html')
        .pipe($.replace(/\/static/g, '../../static'))
        .pipe($.replace(/"(\/)bower_components\/(.*)\/([a-zA-Z0-9.]+\.js)(.*)"/g, '"../../static/js/$3$4"'))
        .pipe($.prettify({indent_size: 2}))
        .pipe(gulp.dest(svn.path + '/thirdPart/' + Settings.name));
    });

    gulp.task('third:svnImage', function(next) {
      return gulp.src(thirdStatic+'/images/**/**', {base: 'client'})
        .pipe($.plumber( { errorHandler: $.notify.onError('错误: <%= error.message %>') } ))
        .pipe($.imagemin({
          optimizationLevel: 5,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
        })
      )
        .pipe(gulp.dest(thirdSvnPath));
    });

    // 启动服务进行调试
    gulp.task('third:server', ['third:svnCss', 'third:buildTemplate-noSide'], function(){
      connect.server({
        root: serverRoot,
        port: Settings.port
      });

      console.log('server start at: http://localhost:' + Settings.port + '/_thirdPart/'+ Settings.name)

      Lib.openUrl('http://localhost:' + Settings.port + '/_thirdPart/'+ Settings.name)
    });

    gulp.task('third:watch', function(){
      gulp.watch(config.template + '/**/**.html', ['third:buildTemplate-noSide'])
      gulp.watch(thirdStatic+'/less/**/**.less', ['third:svnCss'])
    })

    // 清除第三方临时文件夹
    gulp.task('third:clean', ['third:svnCss', 'third:svnImage', 'third:svnJs', 'third:svnTemplate'], function(next){
      del([thirdPart, thirdPartDist], next);
      console.log('第三方框架已经生成，请检查svn目录！');
      //del([thirdPart], next);
      //next();
    });

    if(debug) {
      gulp.start(['third:server', 'third:watch']);
    } else {
      gulp.start(['third:clean']);
    }
  };

  for(var task in config.thirdPart) {
    (function(t){
      gulp.task('third:'+ t, function () {
          frameworkTask(config.thirdPart[t]);
      });

      gulp.task('third:'+ t +'-debug', function () {
          frameworkTask(config.thirdPart[t], true);
      });
    })(task);
  }
}

//  sprite 合并任务
//  将 static/images/sprite下的 sprite-*开头的文件夹合并成 sprite-*.png文件
//  同时生成 sprite-*.less,注入_sprite_all.less文件
//
//  npm install gulp.spritesmith imagemin-pngquant merge-stream --save
// 
//  by tommyshao

var gulp = require('gulp');
var config = require('../config.json')
var pkg    = require('../package.json')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()
var Lib        = require('../lib')

// 默认不开启 sprite
var pngquant = require('imagemin-pngquant')
var spritesmith = require('gulp.spritesmith')
var merge = require('merge-stream')


module.exports = function spriteTask() {
  // sprite
  gulp.task('merge-sprite', function(){
      var thisPath = config.staticPath+'/images/sprite'
      var folders = Lib.folders(thisPath)
      var tasks = folders.map(function(folder) {
          var spriteData = gulp.src(path.join(thisPath, folder, '/*.*'))
                          .pipe($.changed(config.staticPath+'/images/sprite'))
                          .pipe($.newer(config.staticPath+'/images/sprite'))
                          .pipe(spritesmith({
                              imgPath: '../images/sprite/'+ folder +'.png?v='+config.version,
                              imgName: folder+'.png',
                              cssName: '_'+ folder +'.css'
                              ,padding: config.sprite_padding
                            }))
          var imgPipe = spriteData.img.pipe(gulp.dest(config.staticPath+'/images/sprite'))
          var cssPipe = spriteData.css
                                      .pipe($.rename({ extname: '.less'}))
                                      .pipe(gulp.dest(config.staticPath+'/less/sprite-less'))

          return merge(imgPipe, cssPipe);
      })


      return merge(tasks)
  });

  gulp.task('sprite', ['merge-sprite'], function(next){
      var lessFile = [];
      fs.readdirSync(config.staticPath+'/less/sprite-less')
          .map(function(file) {
              /\.less$/.test(file) && lessFile.push('@import "sprite-less/'+ file +'";')
          })

      return gulp.src(config.staticPath+'/less/_sprite_all.less')
          //.pipe($.changed(config.staticPath+'/less'))
          .pipe($.replace(/.*/g, lessFile.join('\n')))
          .pipe(gulp.dest(config.staticPath+'/less'))

  })
}

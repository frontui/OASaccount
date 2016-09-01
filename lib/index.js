/*
* 工具函数类
*/

/*var openURL    = require('./openURL')
var template   = require('./template')
var errHandler = require('./errHandler')
var isFolder   = require('./folders')
var banner     = require('./banner')()

module.exports = {
  openURL   : openURL,
  template  : template,
  errHandler: errHandler,
  isFolder  : isFolder,
  banner    : banner
}*/

var fs   = require('fs')
var path = require('path')

var folder = __dirname
var exports = {}
var prop = '';

fs.readdirSync(folder).filter(function(file) {
  var isFile = fs.statSync(path.join(folder, file)).isFile();
  if(isFile && !/index\.js/.test(file)) {
    prop = file.split('.')[0];
    exports[prop] = require('./'+ file)
  }
})

module.exports = exports


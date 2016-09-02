/*!
* @project : common
* @version : 0.1.0
* @author  : xxx
* @created : xxx
* @description: xxx
*/

// 配置文件
;(function(){
  // 获取网站配置
  var config = typeof window['webConfig'] === 'undefined' ? {} : window['webConfig'];
  // require配置
  require.config({
    // 基本路径
    baseUrl: (function() {
      return config['baseUrl'] || '/static/js';
    })(),
    // 版本号
    urlArgs: (function(){
      return config['ver'] ? 'ver='+ config['ver'] : "debug=" +  (new Date()).getTime()
    })(),
    // 别名
    paths: {
      'jquery': '/bower_components/jquery/dist/jquery.min',
      'ui': '/bower_components/frontui/js/ui',
      'frontui': '/bower_components/frontui/js',
      'userDefine': (function() {
        return config['userDefine'] ? config['userDefine'] : '/userDefine';
      })(),
      'avalon': '/bower_components/avalon/dist/avalon.js'
    },
    // 以来声明
    shim: {
      'ui' : {
        deps: ['jquery']
      }
    }
  });
})();
// common
// 共同部分
require(['jquery', 'ui', 'frontui/datetimepicker/datetimepicker'], function($, UI) {
  // code
});

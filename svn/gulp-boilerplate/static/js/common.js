/*! gulp-boilerplate v1.0.0
*  by frontui
*  (c) 2014-2016 www.frontpay.cn
* updated on 2016-09-01
*  Licensed under Apache-2.0
*/
 !function(){var config="undefined"==typeof window.webConfig?{}:window.webConfig;require.config({baseUrl:function(){return config.baseUrl||"/static/js"}(),urlArgs:function(){return config.ver?"ver="+config.ver:"debug="+(new Date).getTime()}(),paths:{jquery:"jquery.min",ui:"ui",frontui:"js",userDefine:function(){return config.userDefine?config.userDefine:"/userDefine"}(),avalon:"avalon.js","ui/datetimepicker":"frontui/datetimepicker/datetimepicker"},shim:{ui:{deps:["jquery"]},"ui/datetimepicker":{deps:["jquery"]}}})}(),require(["jquery","ui"],function($,UI){});
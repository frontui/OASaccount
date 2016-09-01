//     
//     
//     
//     TommyShao
//     2015/12/28

// useage:
// ------
// 用法
// 配置
// 实例化

;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }

}(this, function ($) {

  $(function(){

    var menuItem = $('.menu a'),
        activeMenu = function(id) {
          var hash = typeof id === 'string' ? '#'+id : location.hash;
          menuItem.map(function() {
            if(this.hash && this.hash == hash){
              menuItem.removeClass('active');
              $(this).addClass('active')
            }
          });
        };
    $(window).on('hashchange', activeMenu);
    activeMenu();

    var waypoints = $('.markdown-body h2').waypoint({
      handler: function(direction) {
        activeMenu(this.element.id)
      }
    })
  })


  return $;

}));
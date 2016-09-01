#  JavaScript组件接口说明文档

##	概述

E+账户移动端在JavaScript架构上使用的是`requirejs`模块化管理框架。所属模块需按`AMD`方式封装。在`DOM`操作库上选择的是`zepto`，弱化(ji)版`jQuery`

[http://zeptojs.com/](http://zeptojs.com/)

[http://requirejs.org/](http://requirejs.org/)

###  amd规范

####  定义

```
// 模块
// define(id, deps, factory)
// * `id` 模块id
// * `deps` 依赖模块
// * `factory` 模块函数

define('components/tab', ['zepto'], function($){
  $.fn.tab = function() {
    $(this).on('tap', function() {
        // ...
    })
  }
})
```

####  使用模块

```
// require([模块1id, 模块2id], callback)

require(['zepto','components/tab'], function($, Tab) {
  $(function(){
      $('.tab').tab();
 })
})
```

##  `tap` 代替 `click`

在移动端用 `tap` 事件可以避免 `click` 的 `300ms` 延迟。

```
require(['zepto'], function($) {
    $('#btn').on('tap', function() {
        // ...
    })
})
```

## 模板引擎template

** 模块id **
`template`

** 使用 **

```
require(['template'], function(Template) {
    var myTemplate = '<%=content%>';
    var content = Template(myTemplate, {content: 'Hello World'})
    alert(content);
})
```

** 参数配置 **

* `tplString` 模板字符串，活动dom元素id
* `data`      填充json数据
* `settings`  上下文作用域

模板引擎与 backbone.js 的模板引擎类似，使用 `$.tpl(tplString, [data], [settings])` 来调用。

模板变量放入`<%= value %>`中，如`<%= value %>`，模板可以直接把js逻辑放入`<% ... %>`中，如`<% if(a){>%` 条件为`ture`，这部分会输出 `<%}%>`。

具体调用方式示例：

```
# js
require(['template', 'zepto'], function(template, $) {
  var data = [
    {title: 'apple', amount: 1},
    {title: 'orange', amount: 2}
  ];
  var content = template(document.getElementById('j-tmpl').innerHTML, {list: data});
  $('#test').html(content);
})

# html
<script type="text/html" id="j-tmpl">
  <ul>
     <% for(var i= 0; i < list.length; i++ ){%>
       <li><%= list[i].title %></li>
     <% } %>
  </ul>
</script>
```

** 字符串变量模板 **

```
var data={
    name:"jeakey",
    word:"hi~",
    friend:[
        "hahn",
        "fay"
    ]
}

var tplHTML='<div><%=name%> say <%=word%>。</div>'+
            '<div>his friends:<ul>'+
            '<% for(var i=0;i<friend.length;i++){ %>'+
            '<li><%=friend[i]%></li>'+
            '<% } %></ul></div>';

var dest=$.tpl(tplHTML,data);
console.log(dest)
// output：<div>jeakey say hi~。</div><div>his friends:<ul><li>hahn</li><li>fay</li></ul></div>
```

## 搜索框(searchBar)

** 模块id **

`components/searchBar`

** html结构 **

```
<div class="searchbar">
  <input type="search" id="{{id}}"  data-toggle="searchbar" name="search" value="" class="searchbar-control" autocomplete="off">
  <label for="{{id}}" class="searchbar-control-label">
    <i class="icon-search"></i>
    <span>{{placeholder}}</span>
  </label>
</div>
```
在搜索文本框增加 `data-toggle="searchbar"`属性,默认全局绑定该插件。

** 方法 **

* `search:keyup` 输入文字后

```
require(['components/searchBar'], function(SearchBar) {
    $(el).on('search:keyup', function(e){
        var text = e.keywords;
        // var text = $.trim($(this).val());
        // todo ...
    })
})
```

## 面板(panel)

** 模块id **

`components/panel`

** 使用 **

```
require(['components/panel'], function(Panel) {
    $('.panel').panel();
    // new Panel(el, option)
})
```


面板主要是做展示更多内容的交互功能。默认绑定`.panel`类元素。

** 参数配置 **

*  `trigger(.panel-btn)` 触发元素
*  `active(show)`  点击激活展开样式
*  `callback(true|false)` 展开或收起回调

** js调用 **

```
$('#test').panel({
    trigger: '.trigger',
    active: 'active',
    callback: function(isShown) {
      alert(isShown)
    }
});
```

** demo **
```
<div class="panel">
    <div class="panel-title">
        <span class="heading-FontColor">大疆无人机2321型号 黑色</span>
    </div>
    <div class="panel-btn">
        <a href="#" class="link-standard">详情</a>
        <span><i class="icon-chevron-thin-down"></i></span>
    </div>
    <div class="panel-cnt">
        <dl class="panel-table heading-FontColor border-t">
           <dt>订单号：20151029210</dt>
           <dd>商家：一号店</dd>
        </dl>
        <dl class="panel-table heading-FontColor border-t pdb0 fs-20">
            <dt>
                Apple iphone 6 Plus(A1524)16GB
                金色 移动联通电信4G手机
            </dt>
            <dd>
                <em>￥100.00</em>
                <span class="viceText-FontColor">×1</span>
            </dd>
            <dt>
                Apple iphone 6 Plus(A1524)16GB
                金色 移动联通电信4G手机
            </dt>
            <dd>
                <em>￥100.00</em>
                <span class="viceText-FontColor">×1</span>
            </dd>
        </dl>
    </div>
</div>
```

## 选项卡(tab)

** 模块id **

`components/tab`

** 用法 **

```
require(['components/tab'], function(Tab) {
    $('.tab').tab()
})
```

** 事件监听 **

```
require(['components/tab'], function(Tab) {
    $('.tab').on('tab:active', function(e) {
        var index = e.index;
        // 当前点击tab导航索引
        console.log(index); 
    })
})
```

选项主要是做当前页面多个内容切换的交互功能。默认绑定`.tab`类元素。

** 参数配置 **

*  `nav(.tab-nav)` 切换导航元素
*  `navItem(li)`  切换导航项
*  `content(.tab-content)` 内容容器
*  `item(li)` 内容项
*  `callback(function(index))` 回调

** js调用 **

```
$('#test').tab({
    nav: '.nav',
    navItem: '.nav-item',
    content: '.content',
    item: '.content-item',
    callback: function(index) {
      // index 当前索引
      // this指向当前插件实例
      // this.$el => $('#test')
      // this.$nav => $('#test').find('.nav-item')
      // this.$navItem => $('#test').find('.nav-item')
      // this.$content => $('#test').find('.content')
      // this.$item => $('#test').find('.content-item')
    }
});
```

** demo **
```
<div class="tab" id="demo">
    <ul class="tab-nav">
        <li class="current">最近三个月</li>
        <li>三个月前</li>
    </ul>
    <ul class="tab-content">
        <li class="current">
            <ul class="list">
                <li>
                    <div class="list-info">
                        <h5>招商银行丨尾号1233</h5>
                        <p>2015-11-16  13:52:40</p>
                    </div>
                    <div class="list-bar">
                        +50.00元
                    </div>
                </li>
                <li>2222222</li>
                <li>333333</li>
            </ul>
        </li>
        <li>
            <ul class="list list-link">
                <li>111111</li>
                <li>2222222</li>
                <li>333333</li>
            </ul>
        </li>
    </ul>
</div>
```

** 使用接口 **

```
require(['components/tab'], function(Tab) {
     // 切换到第二选项
     $('#demo').tab('active', 1)
 });
```

## 加载层(Loading)

** 模块id **

`components/loading`

** 用法 **

```
require(['components/loading'], function(Loading) {
    $.loading({content: 'Loading...'});
    // $.dialog('hide')
})
```

** 参数配置 **

* `content` 提示文字

** 调用 **

```
$.loading({content: 'Loading...'})
```

带`id`标识

```
$('#loading').loading({content: 'Loading'})
```

** 方法 **

```
require(['components/loading'], function(Loading) {
  // 显示
  var Loading = $.loading('show')
  // 隐藏
  Loading.loading('hide')
})
```

## 弹出层(Dialog)

** 模块id **

`components/dialog`

** 用法 **

```
require(['components/dialog'], function(Dialog) {
  // var el = $.dialog({content: 'xxxx'});
  // el.dialog('hide');
  // el.dialog('show');

  // 1. $.dialog(option)
  // 2. $('<div><%=content%></div>').dialog(options);
  // 3. $('#id').dialog();
})
```

** 参数配置 **

* `title` 提示标题
* `content` 提示内容
* `button(array|['确定'])` 按钮组
* `allowScroll` 跟随滚动条滚动

** 弹出页面元素 **

html:

```
<div class="dialog" id="dialog">
    <div class="dialog-cnt">
        <div class="dialog-bd simselect">
            <h4>title</h4>
            <div>xxxx</div>
        </div>
        <div class="dialog-ft btn-group">
            <button class="btn" role="button" type="button">确定</button>
            <button class="btn" role="button" type="button">取消</button>
        </div>
    </div>
</div>
```
JavaScript:

```
require(['components/dialog'], function(Dialog) {
        $('#dialog').dialog('show');
});

```

** 自定义弹层 **

```
require(['components/dialog'], function(Dialog) {
    var dialog = $.dialog({
        title: '温馨提示',
        content: '内容',
        button: ['确定', '取消']
    });
});

```

** 方法接口 **

`show`

显示对话框

```
$('#test').dialog('show');
```

`hide`

隐藏对话框

```
$('#test').dialog('hide');
```


`dialog:action`

监听用户点击了某个按钮, 从事件中可以获取到`index`和当前点中元素`relateTarget`

```
$('#test').on('dialog:action', function(e) {
    // 获取索引
    var index = e.index;
    // 获取当前点中元素
    var that = $(e.relateTarget);
})
```

`dialog:show`

监听弹层显示事件

```
$('#test').on('dialog:show', function(e) {
    alert('显示');
})
```

`dialog:show`

监听弹层隐藏事件

```
$('#test').on('dialog:hide', function(e) {
    alert('隐藏');
})
```

##  加载更多(loadMore)

** 模块id **

`components/loadMore`

** 用法 **

```
require(['components/loadMore'], function(LoadMore) {
    $('#j-load-more-1').on('loadMore:action', function(e) {
        // e.toggle = true 切换到显示loading
        if(e.toggle) {
            // ListLoad.getList(function(){
                // 异步加载完成
                // $(id).loadMore('back') 切换回原来`加载更多`文字
                $('#j-load-more-1').loadMore('back');
            //});
        }
    });
})
```

** 方法 **

点击`加载更多`

`loadMore:action`
    * `e` 参数，事件
        * `e.toggle` 是否被点击


```
    $(id).on('loadMore:action', function(e) {
        var clicked = e.toggle;
    })
```

隐藏loading效果，返回文字状态

`$(id).loadMore('back')`

主要调用`back`方法可以还原最初状态

##  警告提示框(alert)

** 模块id **

`components/alert`

** 用法 **

```
require(['components/alert'], function(Alert) {
    // var alert = new Alert(el, option)
    $('.alert').on('alert:close', function() {
        // todo: 关闭操作
        console.log('---aaaaa')
    })
})
```

** 配置 **

* `el` 元素 (选用，用new Alert需传入第一个参数)
* `option` 配置参数
    * `button` 关闭按钮
    * `callback` 关闭回调

** 方法 **

* 关闭

`alert:close`
    * `e` 参数，事件
        * `e.relatedTarget` 触发元素


```
    $(id).on('alert:close', function() {
         // todo: 关闭操作
         console.log('---aaaaa')
     })
```


## 表单验证

** 模块id **

`components/validator`

** 用法 **

```
require(['components/validator'], function(Validator) {
    $('#j-validate-form').validator();
})
```


###      	目录

*	[特性](#特性)
*	[调用方式](#调用方式)
*	[参数](#参数)
*	[拓展方法](#拓展方法)

#### 	特性

1.	通过 data-* 的方式来来决定表单是否需要验证,验证类型
2.	通过 mvalidateExtend 方法提供自定义拓展验证方式
3.	不同于其他的表单验证,该控件在用户初次输入的时候(keyup事件)是不进行验证的，这样的方式更符合用户的使用习惯

#### 	调用方式
<pre>
$(form).validator({
    type:1,
    validateInSubmit:true
})
</pre>

#### 	参数
参数 | 类型 | 描述 | 默认值
------------ | ------------- | ------------ | ------------
type | Number | 验证类型,类型1：弹出提示信息，类型2：未通过验证的表单下面显示提示文字 | 1
validateInSubmit | Boolean | 点击"提交"按钮的时候是否要对表单进行验证 | true
sendForm | Boolean | 表单通过验证的时候，是否需要提交表单 | true
onKeyup | Boolean | 输入放开键盘的时候,是否需要验证 | false
firstInvalidFocus | Boolean | 未通过验证的第一个表单元素，是否要获取焦点 | true
conditional | Object | 输入域通过data-conditional="name"对应到conditional中属性等于name的函数 | {}
descriptions | Object | 输入域通过data-descriptions="name"对应到descriptions中属性名等于name的函数 | {}
eachField | Function | 输入域在执行验证之前触发该函数| {}
eachInvalidField | Function | 所有未通过验证的表单输入域触发该函数 | $.noop
eachValidField | Function | 所有的通过验证的表单输入域触发该函数 | $.noop
valid | Function | 点击“提交”按钮的时候，若表单通过验证，就触发该函数！ | $.noop
invalid | Function | 点击“提交”按钮的时候，若表单未通过验证，就触发该函数！ | $.noop

#### 	拓展方法
方法| 描述
------------ | -------------
$.validatorExtend | 该方法用来拓展一些输入域的验证,例如:data-validate="phone"
<pre>
$.validatorExtend({
    phone:{
        required : true,   
        pattern : /^0?1[3|4|5|8][0-9]\d{8}$/,
        each:function(){

        },
        descriptions:{
            required : '必填字段',
            pattern : '请您输入正确的格式'
        }
    }
});
</pre>

示例：

```
<form class="zform zform-radius" action="https://www.baidu.com" id="form2">
        <fieldset class="zform-fieldset">
            <div class="zform-control">
                <div class="control-field">
                    <input type="password" class="field-text" placeholder="请输入用户名" data-required="true" data-descriptions="username" data-describedby="username-description">
                </div>
                <div id="username-description"></div>     
            </div>
            <div class="zform-control">
                <div class="control-field">
                    <input type="password" id="pwd2" class="field-text" placeholder="请输入密码" data-required="true" data-descriptions="password" data-describedby="password-description"  data-conditional="pwd2">
                </div>
                <div id="password-description"></div>    
            </div>
            <div class="zform-control">
                <div class="control-field">
                    <input type="password" id="confirmpwd2" class="field-text"  placeholder="再次输入密码确认" data-required="true" data-descriptions="confirmpassword" data-conditional="confirmpwd2" data-describedby="confirmpassword-description">
                </div>
                <div id="confirmpassword-description"></div>
            </div>
            <div class="zform-control">
                <div class="control-field">
                    <input type="text" class="field-text" placeholder="请输入手机号码" data-validate="phone" data-describedby="phone-description">
                </div>
                <div id="phone-description"></div>
            </div>
            <div class="zform-control">
                <div class="control-field">
                    <input type="text" class="field-text" placeholder="请输入年龄" data-pattern="^[0-9]+$"  data-required="true" data-descriptions="age" data-describedby="age-description">
                </div>
                <div id="age-description"></div>
            </div>
            <div class="zform-control">
                <div class="control-field">
                    <select class="field-select" data-required="true" data-descriptions="address" data-describedby="address-description" placeholder="请选择省事">
                        <option value=""></option>
                        <option value="1">浙江省</option>
                        <option value="2">海南省</option>
                    </select>
                </div>
                <div id="address-description"></div>
            </div>
            <div class="zform-control">

                <div class="control-field">
                    <textarea class="field-area" placeholder="个人简介" rows="4" data-required="true" data-descriptions="intro" data-describedby="intro-description"></textarea>
                </div>
                <div id="intro-description"></div>
            </div>
            <div class="zform-control zform-control-radiocheck">
                <label class="control-label">兴趣爱好：</label>
                <div class="control-field">
                    <label>
                        <input type="checkbox"  name="favourite" class="field-check zicon" data-required="true" data-descriptions="favourite" data-describedby="favourite-description">篮球
                    </label>    
                    <label>
                        <input type="checkbox" name="favourite" class="field-check zicon" data-required="true" data-descriptions="favourite" data-describedby="favourite-description">足球
                    </label>    
                    <label>
                        <input type="checkbox" name="favourite" class="field-check zicon" data-required="true" data-descriptions="favourite" data-describedby="favourite-description">排球
                    </label>
                    <label>
                        <input type="checkbox" name="favourite" class="field-check zicon" data-required="true" data-descriptions="favourite" data-describedby="favourite-description">乒乓球
                    </label>    
                </div>
                <div id="favourite-description"></div>
            </div>
            <div class="zform-control zform-control-radiocheck">
                <label class="control-label">性别：</label>
                <div class="control-field">
                    <label>
                        <input type="radio" name="sex" class="field-radio  zicon" data-required="true"  data-descriptions="sex" data-describedby="sex-description">男
                    </label>    
                    <label>
                        <input type="radio"  name="sex" class="field-radio  zicon" data-required="true" data-descriptions="sex" data-describedby="sex-description">女
                    </label>    
                </div>
                <div id="sex-description"></div>
            </div>
        </fieldset>
        <input type="submit" value="提交" class="zbtn zbtn-primary zbtn-full zbtn-lg">   
  </form>
```

JavaScript:

```
require(['components/validator'], function(Validtor) {

  $.validatorExtend({
      // 扩展data-validate方式
      phone:{
          // 必填
          required : true,
          // 验证正则   
          pattern : /^0?1[3|4|5|8][0-9]\d{8}$/,
          each:function(){

          },
          // 错误提示
          descriptions:{
              required : '<div class="field-invalidmsg">必填字段</div>',
              pattern : '<div class="field-invalidmsg">请您输入正确的格式</div>',
              valid : '<div class="field-validmsg">正确</div>'
          }
      }
  });

  $("#form2").validator({
      type:2,
      onKeyup:true,
      sendForm:true,
      firstInvalidFocus:true,
      eachField:function(){

      },
      valid:function(){

      },
      invalid:function(){

      },
      eachValidField:function(){

      },
      eachInvalidField:function(){


      },
      // 附加条件
      conditional:{
           pwd2:function(event,options){
              var flag=true,
                  pwdVal=$.trim($("#pwd2").val()),
                  confirmVal=$.trim($("#confirmpwd2").val());
              //判断确认密码是否为空，不为空的时候,然后和当前对比, 为空就是正常验证
              if(!!confirmVal){
                  flag=(confirmVal==pwdVal) ? true :false;
                  if(!flag){
                      $("#confirmpassword-description .zvalid-resultformat").html(options.descriptions.confirmpassword.conditional)
                  }else{
                       $("#confirmpassword-description .zvalid-resultformat").html(options.descriptions.confirmpassword.valid)
                  }     
              }
              return flag;
          },
          confirmpwd2:function(){
              // 两次密码是否一致
              return $("#pwd2").val()==$("#confirmpwd2").val();
          }
      },
      // 错误提示
      descriptions:{
          username:{
              // 必填
              required : '<div class="field-invalidmsg">请输入用户名</div>',
              // 验证通过
              valid : '<div class="field-validmsg">验证通过</div>'
          },
          age : {
              // 必填
              required : '<div class="field-invalidmsg">请输入年龄</div>',
              // 自定义正则
              pattern : '<div class="field-invalidmsg">你输入的格式不正确</div>',
              valid : '<div class="field-validmsg">验证通过</div>'
          },
          password:{
               required : '<div class="field-invalidmsg">请输入密码</div>',
               // 附加条件
               conditional : '<div class="field-validmsg">验证通过</div>',
               valid : '<div class="field-validmsg">验证通过</div>'
          },
          confirmpassword:{
              required : '<div class="field-invalidmsg">请再次输入密码</div>',
              conditional : '<div class="field-invalidmsg">两次密码不一样</div>',
              valid : '<div class="field-validmsg">验证通过</div>'
          },
          address:{
              required : '<div class="field-invalidmsg">请选择地址</div>',
              valid : '<div class="field-validmsg">验证通过</div>'
          },
          intro:{
              required : '<div class="field-invalidmsg">请输入个人介绍</div>',
              valid : '<div class="field-validmsg">验证通过</div>'
          },
          favourite:{
              required : '<div class="field-invalidmsg">请选择个人爱好</div>',
              valid : '<div class="field-validmsg">验证通过</div>'
          },
          sex:{
              required : '<div class="field-invalidmsg">请输入性别</div>',
              valid : '<div class="field-validmsg">验证通过</div>'
          }
      }
  });
});
```
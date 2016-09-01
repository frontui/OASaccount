# gulp 构建环境模板

## Install

```
> git clone http://git-frontpay.cn/gulp-boilerplate.git [myproject]
```

在终端中将模板拷贝到`myproject`[项目名称，自定义]目录，然后进入文件夹`cd myproject`

## 安装 node 包依赖

切换到`cnpm`速度更快一些

```
npm config set registry https://registry.npm.taobao.org
```

切换后

```
npm install -d

```

## 选择 ui 框架

执行命令自动从 `bower` 上安装最新的 ui 框架，ui框架在更新文件必须打上 `tag` 或版本

```
gulp frontui
```

暂时无添加`Brickplus`

## 启动项目

如需修改启动服务端口号，防止与其他项目端口冲突,修改`config.json`

```
npm start
```

## 发布项目

修改`svn.json`文件中的`path`字段和端口号

```
{
	"name": "projectName",
	"version": "1.0.0",
	"port": 3002,
	"path": "../../svn/projectName",
	"staticPath": "/static"
}
```


修改完成后再终端输入

```
npm run build
```

## HTTP 服务

由`generator-frontman`使用的`connect`迁移到`browser-sync`，功能更强大更性感

`brower-sync`提供了多浏览器即时刷新和同步，方便移动端项目debug调试，同时提供了强大的 UI 界面功能管理


## zip打包

要执行生成目录的打包命令，在终端中输入

```
> gulp build:zip
```

## 更新到 TFS

在 build 检测页面没有问题后，使用 TFS 任务更新到 TFS 上

```
gulp tfs -m 'xxxxxx'
```

## 关于 mock

不建议在项目目录使用`.json`文件，统一在 mock 服务器做数据返回,并使用代理

[http://192.168.8.160:2016](http://192.168.8.160:2016)

## 更新Brickplus-Mixin less库

更新最新的 `mixin` 库

```
gulp mixin
```

## 项目 js 文档

`doc`目录提供我们使用 `markdown` 文件编写项目 javascript 函数用法，使用命令可以一键转换成 `html`

```
gulp docs
```


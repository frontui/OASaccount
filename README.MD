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
# React • TodoMVC

主要[参考todomvc](https://github.com/tastejs/todomvc/tree/master/examples/react)使用React部分的实现。

并自行使用了React进行实现，之后应该会继续修改，代码规范以及一些写法还有很多可以完善的地方。

### 准备工作

* 安装Node.js

* 安装Webpack（-g代表全局安装webpack）

  ```
  npm install webpack -g
  ```

* Webpack配置文件

  见`webpack.config.js`

* 安装依赖

  安装React：

  ```
  npm install react react-dom --save
  ```

  安装 jQuery

  ```
  npm install jquery --save
  ```

  安装 [Babel](https://babeljs.io/) 的 loader 以支持 ES6 语法:

  ```
  npm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev
  ```

  因为涉及到图片和css文件，它们是作为模块被引用到`app.jsx`中的，所以需要安装对应的loader：

  ```
  npm install url-loader file-loader --save-dev
  npm install css-loader style-loader --save-dev
  ```

* 运行`webpack`打包

* 运行`webpack-dev-server`启动服务器，然后访问[http://localhost:8080/build/index.html](http://localhost:8080/build/index.html)

  如无意外，应该就可以看到效果啦

以上配置[参考这里](https://github.com/theJian/build-a-hn-front-page)
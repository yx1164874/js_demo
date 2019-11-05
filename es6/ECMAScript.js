import '@babel/polyfill';

require("@babel/polyfill")

/*
ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准
已经在 2015 年 6 月正式发布了。
它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，
成为企业级开发语言。
*/


//Babel 转码器



/*
Babel 是一个广泛使用的 ES6 转码器，
可以将 ES6 代码转为 ES5 代码，从而在现有环境执行。
这意味着，你可以用 ES6 的方式编写程序，又不用担心现有环境是否支持。
下面是一个例子。
*/

// 转码前
input.map(item => item + 1);

// 转码后
input.map(function (item) {
    return item + 1;
});

/*
上面的原始代码用了箭头函数，Babel 将其转为普通函数，
就能在不支持箭头函数的 JavaScript 环境执行了。
*/

//npm install --save-dev @babel/core

/*
配置文件.babelrc
Babel 的配置文件是.babelrc，
存放在项目的根目录下。使用 Babel 的第一步，就是配置这个文件。
该文件用来设置转码规则和插件，基本格式如下。

{
  "presets": [],
  "plugins": []
}

*/




/*
presets字段设定转码规则，官方提供以下的规则集，你可以根据需要安装。

# 最新转码规则
$ npm install --save-dev @babel/preset-env

# react 转码规则
$ npm install --save-dev @babel/preset-react
然后，将这些规则加入.babelrc。

  {
    "presets": [
      "@babel/env",
      "@babel/preset-react"
    ],
    "plugins": []
  }

*/

//注意，以下所有 Babel 工具和模块的使用，都必须先写好.babelrc。

// 命令行转码
// Babel 提供命令行工具@babel/cli，用于命令行转码。
// npm install --save-dev @babel/cli

/*
@babel/polyfill
Babel 默认只转换新的 JavaScript 句法（syntax），
而不转换新的 API，比如
Iterator、Generator、Set、Map、Proxy、Reflect、Symbol、Promise等全局对象，
以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。
举例来说，ES6 在Array对象上新增了Array.from方法。
Babel 就不会转码这个方法。
如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。

安装命令如下。
//npm install --save-dev @babel/polyfill
*/



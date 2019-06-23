// 5.5.1　现代的模块机制
// 大多数模块依赖加载器 / 管理器本质上都是将这种模块定义封装进一个友好的 API。这里
// 并不会研究某个具体的库， 为了宏观了解我会简单地介绍一些核心概念：

var MyModules = (function Manager() {
    var modules = {};
    function define(name, deps, impl) {
        for (var i = 0; i < deps.length; i++) {
            deps[i] = modules[deps[i]];
        }
        modules[name] = impl.apply(impl, deps);
    }

    function get(name) {
        return modules[name];
    }

    return {
        define: define,
        get: get
    };
})();

// 这段代码的核心是 modules[name] = impl.apply(impl, deps) 。为了模块的定义引入了包装
// 函数（可以传入任何依赖），并且将返回值，也就是模块的 API，储存在一个根据名字来管
// 理的模块列表中。
// 下面展示了如何使用它来定义模块：


MyModules.define("bar", [], function () {
    function hello(who) {
        return "Let me introduce: " + who;
    }
    return {
        hello: hello
    };
});

MyModules.define("foo", ["bar"], function (bar) {
    var hungry = "hippo";
    function awesome() {
        console.log(bar.hello(hungry).toUpperCase());
    }
    return {
        awesome: awesome
    };
});
var bar = MyModules.get("bar");
var foo = MyModules.get("foo");
console.log(
    bar.hello("hippo")
); // Let me introduce: hippo
foo.awesome(); // LET ME INTRODUCE: HIPPO


// "foo" 和 "bar" 模块都是通过一个返回公共 API 的函数来定义的。 "foo" 甚至接受 "bar" 的
// 示例作为依赖参数，并能相应地使用它。
// 为我们自己着想，应该多花一点时间来研究这些示例代码并完全理解闭包的作用吧。最重
// 要的是要理解模块管理器没有任何特殊的“魔力”。它们符合前面列出的模块模式的两个
// 特点：为函数定义引入包装函数，并保证它的返回值和模块的 API 保持一致。
// 换句话说，模块就是模块，即使在它们外层加上一个友好的包装工具也不会发生任何变化。




// 5.5.2　未来的模块机制
// ES6 中为模块增加了一级语法支持。但通过模块系统进行加载时， ES6 会将文件当作独立
// 的模块来处理。每个模块都可以导入其他模块或特定的 API 成员，同样也可以导出自己的
// API 成员。
// 基于函数的模块并不是一个能被稳定识别的模式（编译器无法识别），它们
// 的 API 语义只有在运行时才会被考虑进来。因此可以在运行时修改一个模块
// 的 API（参考前面关于公共 API 的讨论）。
// 相比之下， ES6 模块 API 更加稳定（ API 不会在运行时改变）。由于编辑器知
// 道这一点，因此可以在（的确也这样做了）编译期检查对导入模块的 API 成
// 员的引用是否真实存在。如果 API 引用并不存在，编译器会在运行时抛出一
// 个或多个“早期”错误，而不会像往常一样在运行期采用动态的解决方案。
// ES6 的模块没有“行内”格式，必须被定义在独立的文件中（一个文件一个模块）。浏览
// 器或引擎有一个默认的“模块加载器”（可以被重载，但这远超出了我们的讨论范围）可
// 以在导入模块时异步地加载模块文件。
// 考虑以下代码：
// bar.js

function hello(who) {
    return "Let me introduce: " + who;
}
export hello;
// foo.js
// 仅从 "bar" 模块导入 hello()
import hello from "bar";
var hungry = "hippo";
function awesome() {
    console.log(
        hello(hungry).toUpperCase()
    );
}
export awesome;
// baz.js
// 导入完整的 "foo" 和 "bar" 模块


module foo from "foo";
module bar from "bar";
console.log(
    bar.hello("rhino")
); // Let me introduce: rhino
foo.awesome(); // LET ME INTRODUCE: HIPPO
// 需要用前面两个代码片段中的内容分别创建文件 foo.js 和 bar.js。然后如第三
// 个代码片段中展示的那样， bar.js 中的程序会加载或导入这两个模块并使用
// 它们。
// import 可以将一个模块中的一个或多个 API 导入到当前作用域中，并分别绑定在一个变量
// 上（在我们的例子里是 hello）。 module 会将整个模块的 API 导入并绑定到一个变量上（在
// 我们的例子里是 foo 和 bar）。 export 会将当前模块的一个标识符（变量、函数）导出为公
// 共 API。这些操作可以在模块定义中根据需要使用任意多次。
// 模块文件中的内容会被当作好像包含在作用域闭包中一样来处理，就和前面介绍的函数闭
// 包模块一样。

// 5.6　小结
// 闭包就好像从 JavaScript 中分离出来的一个充满神秘色彩的未开化世界，只有最勇敢的人
// 才能够到达那里。但实际上它只是一个标准，显然就是关于如何在函数作为值按需传递的
// 词法环境中书写代码的。
// 当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时
// 就产生了闭包。
// 如果没能认出闭包，也不了解它的工作原理，在使用它的过程中就很容易犯错，比如在循
// 环中。但同时闭包也是一个非常强大的工具，可以用多种形式来实现模块等模式。
// 模块有两个主要特征：（ 1）为创建内部作用域而调用了一个包装函数；（ 2）包装函数的返回
// 值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的闭
// 包。
// 现在我们会发现代码中到处都有闭包存在，并且我们能够识别闭包然后用它来做一些有用
// 的事！
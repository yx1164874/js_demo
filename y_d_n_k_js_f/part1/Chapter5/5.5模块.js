// 5.5　模块
// 还有其他的代码模式利用闭包的强大威力，但从表面上看，它们似乎与回调无关。下面一
// 起来研究其中最强大的一个： 模块。


function foo() {
    var something = "cool";
    var another = [1, 2, 3];
    function doSomething() {
        console.log(something);
    }
    function doAnother() {
        console.log(another.join(" ! "));
    }
}


// 正如在这段代码中所看到的，这里并没有明显的闭包，只有两个私有数据变量 something
// 和 another，以及 doSomething() 和 doAnother() 两个内部函数，它们的词法作用域（而这
// 就是闭包）也就是 foo() 的内部作用域。
// 接下来考虑以下代码：


function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];
    function doSomething() {
        console.log(something);
    }
    function doAnother() {
        console.log(another.join(" ! "));
    }
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}

var foo = CoolModule();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3


// 这个模式在 JavaScript 中被称为模块。最常见的实现模块模式的方法通常被称为模块暴露，
// 这里展示的是其变体。
// 我们仔细研究一下这些代码。
// 首先， CoolModule() 只是一个函数，必须要通过调用它来创建一个模块实例。如果不执行
// 外部函数，内部作用域和闭包都无法被创建。
// 其次， CoolModule() 返回一个用对象字面量语法 { key: value, ... } 来表示的对象。这
// 个返回的对象中含有对内部函数而不是内部数据变量的引用。我们保持内部数据变量是隐
// 藏且私有的状态。可以将这个对象类型的返回值看作本质上是模块的公共 API。
// 这个对象类型的返回值最终被赋值给外部的变量 foo，然后就可以通过它来访问 API 中的
// 属性方法，比如 foo.doSomething() 。
// 从模块中返回一个实际的对象并不是必须的，也可以直接返回一个内部函
// 数。 jQuery 就是一个很好的例子。 jQuery 和 $ 标识符就是 jQuery 模块的公
// 共 API，但它们本身都是函数（由于函数也是对象，它们本身也可以拥有属
// 性）。
// doSomething() 和 doAnother() 函数具有涵盖模块实例内部作用域的闭包（通过调用
// CoolModule() 实现）。当通过返回一个含有属性引用的对象的方式来将函数传递到词法作
// 用域外部时，我们已经创造了可以观察和实践闭包的条件。
// 如果要更简单的描述，模块模式需要具备两个必要条件。

// 1. 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块
// 实例）。
// 2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并
// 且可以访问或者修改私有的状态。
// 一个具有函数属性的对象本身并不是真正的模块。从方便观察的角度看，一个从函数调用
// 所返回的，只有数据属性而没有闭包函数的对象并不是真正的模块。
// 上一个示例代码中有一个叫作 CoolModule() 的独立的模块创建器，可以被调用任意多次，
// 每次调用都会创建一个新的模块实例。当只需要一个实例时，可以对这个模式进行简单的
// 改进来实现单例模式：


var foo = (function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];
    function doSomething() {
        console.log(something);
    }
    function doAnother() {
        console.log(another.join(" ! "));
    }
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
})();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3


// 我们将模块函数转换成了 IIFE（参见第 3 章）， 立即调用这个函数并将返回值直接赋值给
// 单例的模块实例标识符 foo。
// 模块也是普通的函数，因此可以接受参数：


function CoolModule(id) {
    function identify() {
        console.log(id);
    }
    return {
        identify: identify
    };
}
var foo1 = CoolModule("foo 1");
var foo2 = CoolModule("foo 2");

foo1.identify(); // "foo 1"
foo2.identify(); // "foo 2"


// 模块模式另一个简单但强大的变化用法是，命名将要作为公共 API 返回的对象：

var foo = (function CoolModule(id) {
    function change() {
        // 修改公共 API
        publicAPI.identify = identify2;
    }
    function identify1() {
        console.log(id);
    }
    function identify2() {
        console.log(id.toUpperCase());
    }
    var publicAPI = {
        change: change,
        identify: identify1
    };
    return publicAPI;
})("foo module");
foo.identify(); // foo module
foo.change();
foo.identify(); // FOO MODULE

// 通过在模块实例的内部保留对公共 API 对象的内部引用，可以从内部对模块实例进行修
// 改，包括添加或删除方法和属性， 以及修改它们的值。

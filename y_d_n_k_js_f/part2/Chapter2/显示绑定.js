// 2.2.3　显式绑定
// 就像我们刚才看到的那样，在分析隐式绑定时，我们必须在一个对象内部包含一个指向函
// 数的属性，并通过这个属性间接引用函数，从而把 this 间接（隐式）绑定到这个对象上。
// 那么如果我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数，该怎么
// 做呢？
// JavaScript 中的“所有”函数都有一些有用的特性（这和它们的[[原型]] 有关——之后我
// 们会详细介绍原型），可以用来解决这个问题。具体点说，可以使用函数的 call(..) 和
// apply(..) 方法。严格来说， JavaScript 的宿主环境有时会提供一些非常特殊的函数，它们
// 并没有这两个方法。但是这样的函数非常罕见， JavaScript 提供的绝大多数函数以及你自
// 己创建的所有函数都可以使用 call(..) 和 apply(..) 方法。
// 这两个方法是如何工作的呢？它们的第一个参数是一个对象，它们会把这个对象绑定到
// this，接着在调用函数时指定这个 this。因为你可以直接指定 this 的绑定对象，因此我
// 们称之为显式绑定。
// 思考下面的代码：

function foo() {
    console.log(this.a);
}
var obj = {
    a: 2
};
foo.call(obj); // 2
// 通过 foo.call(..) ，我们可以在调用 foo 时强制把它的 this 绑定到 obj 上。
// 如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作 this 的绑定对
// 象，这个原始值会被转换成它的对象形式（也就是 new String(..) 、 new Boolean(..) 或者
// new Number(..) ）。这通常被称为“装箱”。
// 从 this 绑定的角度来说， call(..) 和 apply(..) 是一样的，它们的区别体现
// 在其他的参数上，但是现在我们不用考虑这些。
// 可惜， 显式绑定仍然无法解决我们之前提出的丢失绑定问题。
// 1. 硬绑定
// 但是显式绑定的一个变种可以解决这个问题。
// 思考下面的代码：
function foo() {
    console.log(this.a);
}
var obj = {
    a: 2
};
var bar = function () {
    foo.call(obj);
};
bar(); // 2
setTimeout(bar, 100); // 2
// 硬绑定的 bar 不可能再修改它的 this
bar.call(window); // 2

// 我们来看看这个变种到底是怎样工作的。我们创建了函数 bar() ，并在它的内部手动调用
// 了 foo.call(obj) ，因此强制把 foo 的 this 绑定到了 obj。无论之后如何调用函数 bar，它
// 总会手动在 obj 上调用 foo。这种绑定是一种显式的强制绑定，因此我们称之为硬绑定。
// 硬绑定的典型应用场景就是创建一个包裹函数，传入所有的参数并返回接收到的所有值：

function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}
var obj = {
    a: 2
};
var bar = function () {
    return foo.apply(obj, arguments);
};
var b = bar(3); // 2 3
console.log(b); // 5

// 另一种使用方法是创建一个 i 可以重复使用的辅助函数：

function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}
// 简单的辅助绑定函数
function bind(fn, obj) {
    return function () {
        return fn.apply(obj, arguments);
    };
}
var obj = {
    a: 2
};
var bar = bind(foo, obj);
var b = bar(3); // 2 3
console.log(b); // 5

// 由于硬绑定是一种非常常用的模式，所以在 ES5 中提供了内置的方法 Function.prototype.
//     bind，它的用法如下：

function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}

var obj = {
    a: 2
};
var bar = foo.bind(obj);
var b = bar(3); // 2 3
console.log(b); // 5

// bind(..) 会返回一个硬编码的新函数，它会把参数设置为 this 的上下文并调用原始函数。
// 2. API调用的“上下文”
// 第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一
// 个可选的参数，通常被称为“上下文”（ context），其作用和 bind(..) 一样，确保你的回调
// 函数使用指定的 this。
// 举例来说：

function foo(el) {
    console.log(el, this.id);
}
var obj = {
    id: "awesome"
};
// 调用 foo(..) 时把 this 绑定到 obj
[1, 2, 3].forEach(foo, obj);
// 1 awesome 2 awesome 3 awesome
// 这些函数实际上就是通过 call(..) 或者 apply(..) 实现了显式绑定，这样你可以少些一些
// 代码。
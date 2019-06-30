// 2.2.2　隐式绑定
// 另一条需要考虑的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包
// 含，不过这种说法可能会造成一些误导。
// 思考下面的代码：


function foo() {
    console.log(this.a);
}
var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2

// 首先需要注意的是 foo() 的声明方式，及其之后是如何被当作引用属性添加到 obj 中的。
// 但是无论是直接在 obj 中定义还是先定义再添加为引用属性，这个函数严格来说都不属于
// obj 对象。
// 然而，调用位置会使用 obj 上下文来引用函数，因此你可以说函数被调用时 obj 对象“拥
// 有”或者“包含”它。
// 无论你如何称呼这个模式，当 foo() 被调用时，它的落脚点确实指向 obj 对象。当函数引
// 用有上下文对象时， 隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。因为调
// 用 foo() 时 this 被绑定到 obj，因此 this.a 和 obj.a 是一样的。
// 对象属性引用链中只有最顶层或者说最后一层会影响调用位置。举例来说：


function foo() {
    console.log(this.a);
}
var obj2 = {
    a: 42,
    foo: foo
};
var obj1 = {
    a: 2,
    obj2: obj2
};

obj1.obj2.foo(); // 42

// 隐式丢失
// 一个最常见的 this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默
// 认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式。
// 思考下面的代码：

function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
};
var bar = obj.foo; // 函数别名！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"


// 虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的
// bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。
// 一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时：


function foo() {
    console.log(this.a);
}
function doFoo(fn) {
    // fn 其实引用的是 foo
    fn(); // <-- 调用位置！
}
var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // a 是全局对象的属性
doFoo(obj.foo); // "oops, global"

// 参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值，所以结果和上一
// 个例子一样。

// 如果把函数传入语言内置的函数而不是传入你自己声明的函数，会发生什么呢？结果是一
// 样的，没有区别：

function foo() {
    console.log(this.a);
    
}
var obj = {
    a: 2,
    foo: foo
};
var a = "oops, global"; // a 是全局对象的属性

setTimeout(obj.foo, 100); // "oops, global"

// JavaScript 环境中内置的 setTimeout() 函数实现和下面的伪代码类似：

function setTimeout(fn, delay) {
    // 等待 delay 毫秒
    fn(); // <-- 调用位置！
}

// 就像我们看到的那样，回调函数丢失 this 绑定是非常常见的。除此之外，还有一种情
// 况 this 的行为会出乎我们意料：调用回调函数的函数可能会修改 this。在一些流行的
// JavaScript 库中事件处理器常会把回调函数的 this 强制绑定到触发事件的 DOM 元素上。
// 这在一些情况下可能很有用，但是有时它可能会让你感到非常郁闷。遗憾的是，这些工具
// 通常无法选择是否启用这个行为。
// 无论是哪种情况， this 的改变都是意想不到的，实际上你无法控制回调函数的执行方式，
// 因此就没有办法控制会影响绑定的调用位置。之后我们会介绍如何通过固定 this 来修复
// （这里是双关，“ 修复”和“固定”的英语单词都是 fixing）这个问题。
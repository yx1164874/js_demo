// 6.5　内省
// 如果你写过许多面向类的程序（无论是使用 JavaScript 还是其他语言），那你可能很熟悉自
// 省。自省就是检查实例的类型。类实例的自省主要目的是通过创建方式来判断对象的结构
// 和功能。
// 下面的代码使用 instanceof（参见第 5 章）来推测对象 a1 的功能：
function Foo() {
    // ...
}
Foo.prototype.something = function () {
    // ...
}
var a1 = new Foo();
// 之后
if (a1 instanceof Foo) {
    a1.something();
}
// 因 为 Foo.prototype（ 不 是 Foo ！） 在 a1 的[[Prototype]] 链 上（ 参 见 第 5 章 ）， 所 以
//     instanceof 操作（会令人困惑地）告诉我们 a1 是 Foo“类”的一个实例。知道了这点后，
// 我们就可以认为 a1 有 Foo“类”描述的功能。
// 当然， Foo 类并不存在，只有一个普通的函数 Foo，它引用了 a1 委托的对象（ Foo.
//     prototype）。从语法角度来说， instanceof 似乎是检查 a1 和 Foo 的关系，但是实际上它想
// 说的是 a1 和 Foo.prototype（引用的对象）是互相关联的。

//     instanceof 语法会产生语义困惑而且非常不直观。如果你想检查对象 a1 和某个对象的关
// 系，那必须使用另一个引用该对象的函数才行——你不能直接判断两个对象是否关联。
// 还记得本章之前介绍的抽象的 Foo / Bar / b1 例子吗，简单来说是这样的：
function Foo() { /* .. */ }
Foo.prototype...

function Bar() { /* .. */ }
Bar.prototype = Object.create(Foo.prototype);
var b1 = new Bar("b1");
// 如果要使用 instanceof 和.prototype 语义来检查本例中实体的关系，那必须这样做：
// 让 Foo 和 Bar 互相关联
Bar.prototype instanceof Foo; // true
Object.getPrototypeOf(Bar.prototype)
    === Foo.prototype; // true
Foo.prototype.isPrototypeOf(Bar.prototype); // true
// 让 b1 关联到 Foo 和 Bar
b1 instanceof Foo; // true
b1 instanceof Bar; // true
Object.getPrototypeOf(b1) === Bar.prototype; // true
Foo.prototype.isPrototypeOf(b1); // true
Bar.prototype.isPrototypeOf(b1); // true
// 显然这是一种非常糟糕的方法。举例来说，（使用类时）你最直观的想法可能是使用 Bar
//     instanceof Foo（因为很容易把“实例”理解成“继承”），但是在 JavaScript 中这是行不通
// 的，你必须使用 Bar.prototype instanceof Foo。
// 还有一种常见但是可能更加脆弱的内省模式，许多开发者认为它比 instanceof 更好。这
// 种模式被称为“鸭子类型”。这个术语源自这句格言“如果看起来像鸭子，叫起来像鸭子，
// 那就一定是鸭子。”
// 举例来说：
if (a1.something) {
    a1.something();
}
// 我们并没有检查 a1 和委托 something() 函数的对象之间的关系，而是假设如果 a1 通过了
// 测试 a1.something 的话，那 a1 就一定能调用.something() （无论这个方法存在于 a1 自身
// 还是委托到其他对象）。 这个假设的风险其实并不算很高。
// 但是“鸭子类型”通常会在测试之外做出许多关于对象功能的假设，这当然会带来许多风
// 险（或者说脆弱的设计）。

// ES6 的 Promise 就是典型的“鸭子类型”（之前解释过，本书并不会介绍 Promise）。
// 出于各种各样的原因，我们需要判断一个对象引用是否是 Promise，但是判断的方法是检
// 查对象是否有 then() 方法。换句话说，如果对象有 then() 方法， ES6 的 Promise 就会认为
// 这个对象是“可持续”（ thenable）的，因此会期望它具有 Promise 的所有标准行为。
// 如果有一个不是 Promise 但是具有 then() 方法的对象，那你千万不要把它用在 ES6 的
// Promise 机制中，否则会出错。
// 这个例子清楚地解释了“鸭子类型”的危害。你应该尽量避免使用这个方法，即使使用也
// 要保证条件是可控的。
// 现在回到本章想说的对象关联风格代码，其内省更加简洁。我们先来回顾一下之前的 Foo /
//     Bar / b1 对象关联例子（只包含关键代码）：

var Foo = { /* .. */ };
var Bar = Object.create(Foo);
Bar...

var b1 = Object.create(Bar);
// 使用对象关联时，所有的对象都是通过[[Prototype]] 委托互相关联，下面是内省的方法，
// 非常简单：
// 让 Foo 和 Bar 互相关联
Foo.isPrototypeOf(Bar); // true
Object.getPrototypeOf(Bar) === Foo; // true
// 让 b1 关联到 Foo 和 Bar
Foo.isPrototypeOf(b1); // true
Bar.isPrototypeOf(b1); // true
Object.getPrototypeOf(b1) === Bar; // true
// 我们没有使用 instanceof，因为它会产生一些和类有关的误解。现在我们想问的问题是
// “你是我的原型吗？”我们并不需要使用间接的形式，比如 Foo.prototype 或者繁琐的 Foo.
//     prototype.isPrototypeOf(..) 。
// 我觉得和之前的方法比起来，这种方法显然更加简洁并且清晰。再说一次，我们认为
// JavaScript 中对象关联比类风格的代码更加简洁（而且功能相同）。
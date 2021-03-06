// #2.2　欺骗词法
// 如果词法作用域完全由写代码期间函数所声明的位置来定义，怎样才能在运行时来“修
// 改”（ 也可以说欺骗）词法作用域呢？
// JavaScript 中有两种机制来实现这个目的。社区普遍认为在代码中使用这两种机制并不是
// 什么好注意。但是关于它们的争论通常会忽略掉最重要的点： 欺骗词法作用域会导致性能
// 下降。
// 在详细解释性能问题之前，先来看看这两种机制分别是什么原理。




// #2.2.1 eval
// JavaScript 中的 eval(..) 函数可以接受一个字符串为参数，并将其中的内容视为好像在书
// 写时就存在于程序中这个位置的代码。换句话说，可以在你写的代码中用程序生成代码并
// 运行，就好像代码是写在那个位置的一样。
// 根据这个原理来理解 eval(..)，它是如何通过代码欺骗和假装成书写时（也就是词法期）
// 代码就在那，来实现修改词法作用域环境的，这个原理就变得清晰易懂了。
// 在执行 eval(..) 之后的代码时，引擎并不“知道”或“在意”前面的代码是以动态形式插
// 入进来，并对词法作用域的环境进行修改的。引擎只会如往常地进行词法作用域查找。
// 考虑以下代码：

var b = 2;
function foo(str, a) {
    eval(str); // 欺骗！
    console.log(a, b);
}

foo("var b = 10;", 1); // 1, 3




// eval(..) 调用中的 "var b = 3;" 这段代码会被当作本来就在那里一样来处理。由于那段代
// 码声明了一个新的变量 b，因此它对已经存在的 foo(..) 的词法作用域进行了修改。事实
// 上，和前面提到的原理一样，这段代码实际上在 foo(..) 内部创建了一个变量 b，并遮蔽
// 了外部（全局）作用域中的同名变量。
// 当 console.log(..) 被执行时，会在 foo(..) 的内部同时找到 a 和 b，但是永远也无法找到
// 外部的 b。因此会输出“ 1, 3”而不是正常情况下会输出的“ 1, 2



// 在严格模式的程序中， eval(..) 在运行时有其自己的词法作用域，意味着其
// 中的声明无法修改所在的作用域。
// function foo(str) {
// "use strict";
// eval( str );
// console.log( a ); // ReferenceError: a is not defined
// }
// foo( "var a = 2" );
// JavaScript 中 还 有 其 他 一 些 功 能 效 果 和 eval(..) 很 相 似。 setTimeout(..) 和
// setInterval(..) 的第一个参数可以是字符串，字符串的内容可以被解释为一段动态生成的
// 函数代码。这些功能已经过时且并不被提倡。不要使用它们！


// 比如：
var obj = {
    a: 1,
    b: 2,
    c: 3
};
// 单调乏味的重复 "obj"
obj.a = 2;
obj.b = 3;
obj.c = 4;
// 简单的快捷方式
with (obj) {
    a = 3;
    b = 4;
    c = 5;
}
// 但实际上这不仅仅是为了方便地访问对象属性。考虑如下代码：
function foo(obj) {
    with (obj) {
        a = 2;
    }
}
var o1 = {
    a: 3
};
var o2 = {
    b: 3
};
foo(o1);
console.log(o1.a); // 2
foo(o2);
console.log(o2.a); // undefined
console.log(a); // 2——不好， a 被泄漏到全局作用域上了！
// 这个例子中创建了 o1 和 o2 两个对象。其中一个具有 a 属性，另外一个没有。 foo(..) 函
// 数接受一个 obj 参数，该参数是一个对象引用，并对这个对象引用执行了 with (obj) {..} 。
// 在 with 块内部，我们写的代码看起来只是对变量 a 进行简单的词法引用，实际上就是一个
// LHS 引用（查看第 1 章），并将 2 赋值给它。
// 当我们将 o1 传递进去， a＝2 赋值操作找到了 o1.a 并将 2 赋值给它，这在后面的 console.
//     log(o1.a) 中可以体现。而当 o2 传递进去， o2 并没有 a 属性，因此不会创建这个属性，
// o2.a 保持 undefined。

// 2.2.3　性能
// eval(..) 和 with 会在运行时修改或创建新的作用域，以此来欺骗其他在书写时定义的词
// 法作用域。
// 你可能会问，那又怎样呢？如果它们能实现更复杂的功能，并且代码更具有扩展性，难道
// 不是非常好的功能吗？答案是否定的。
// JavaScript 引擎会在编译阶段进行数项的性能优化。其中有些优化依赖于能够根据代码的
// 词法进行静态分析，并预先确定所有变量和函数的定义位置，才能在执行过程中快速找到
// 标识符。
// 词法作用域 ｜ 21
// 但如果引擎在代码中发现了 eval(..) 或 with，它只能简单地假设关于标识符位置的判断
// 都是无效的，因为无法在词法分析阶段明确知道 eval(..) 会接收到什么代码，这些代码会
// 如何对作用域进行修改，也无法知道传递给 with 用来创建新词法作用域的对象的内容到底
// 是什么。
// 最悲观的情况是如果出现了 eval(..) 或 with，所有的优化可能都是无意义的，因此最简
// 单的做法就是完全不做任何优化。
// 如果代码中大量使用 eval(..) 或 with，那么运行起来一定会变得非常慢。无论引擎多聪
// 明，试图将这些悲观情况的副作用限制在最小范围内， 也无法避免如果没有这些优化，代
// 码会运行得更慢这个事实

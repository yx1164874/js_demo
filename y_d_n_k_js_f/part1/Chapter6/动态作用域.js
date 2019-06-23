// 动态作用域
// 在第 2 章中，我们对比了动态作用域和词法作用域模型， JavaScript 中的作用域就是词法
// 作用域（事实上大部分语言都是基于词法作用域的）。
// 我们会简要地分析一下动态作用域，重申它与词法作用域的区别。但实际上动态作用域是
// JavaScript 另一个重要机制 this 的表亲，本书第二部分“ this 和对象原型”中会有详细
// 介绍。
// 从第 2 章中可知，词法作用域是一套关于引擎如何寻找变量以及会在何处找到变量的规
// 则。词法作用域最重要的特征是它的定义过程发生在代码的书写阶段（假设你没有使用
// eval() 或 with）。
// 动态作用域似乎暗示有很好的理由让作用域作为一个在运行时就被动态确定的形式，而不
// 是在写代码时进行静态确定的形式，事实上也是这样的。我们通过示例代码来说明：

function foo() {
    console.log(a); // 2
}
function bar() {
    var a = 3;
    foo();
}
var a = 2;
bar();

// 词法作用域让 foo() 中的 a 通过 RHS 引用到了全局作用域中的 a，因此会输出 2。

// 而动态作用域并不关心函数和作用域是如何声明以及在何处声明的，只关心它们从何处调
// 用。换句话说，作用域链是基于调用栈的，而不是代码中的作用域嵌套。
// 因此，如果 JavaScript 具有动态作用域， 理论上，下面代码中的 foo() 在执行时将会输出 3。

function foo() {
    console.log(a); // 3（不是 2 ！ ）
}
function bar() {
    var a = 3;
    foo();
}
var a = 2;
bar();

// 为什么会这样？因为当 foo() 无法找到 a 的变量引用时，会顺着调用栈在调用 foo() 的地
// 方查找 a，而不是在嵌套的词法作用域链中向上查找。由于 foo() 是在 bar() 中调用的，
// 引擎会检查 bar() 的作用域，并在其中找到值为 3 的变量 a。
// 很奇怪吧？现在你可能会这么想。
// 但这其实是因为你可能只写过基于词法作用域的代码（或者至少以词法作用域为基础进行
// 了深入的思考），因此对动态作用域感到陌生。如果你只用基于动态作用域的语言写过代
// 码，就会觉得这是很自然的，而词法作用域看上去才怪怪的。
// 需要明确的是，事实上 JavaScript 并不具有动态作用域。它只有词法作用域，简单明了。
// 但是 this 机制某种程度上很像动态作用域。
// 主要区别：词法作用域是在写代码或者说定义时确定的，而动态作用域是在运行时确定
// 的。（ this 也是！）词法作用域关注函数在何处声明，而动态作用域关注函数从何处调用。
// 最后， this 关注函数如何调用，这就表明了 this 机制和动态作用域之间的关系多么紧密。
// 如果想了解更多关于 this 的详细内容，参见本书第二部分“ this 和对象原型”。
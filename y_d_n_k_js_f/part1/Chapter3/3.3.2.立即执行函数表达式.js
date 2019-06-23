// 3.3.2　立即执行函数表达式


var a = 2;
(function foo() {
    var a = 3;
    console.log(a); // 3
})();
console.log(a); // 2


// 由于函数被包含在一对() 括号内部，因此成为了一个表达式，通过在末尾加上另外一个
//     () 可以立即执行这个函数，比如(function foo() { ..})() 。第一个() 将函数变成表
// 达式，第二个() 执行了这个函数。
// 这种模式很常见，几年前社区给它规定了一个术语： IIFE，代表立即执行函数表达式
// （ Immediately Invoked Function Expression）；
// 函数名对 IIFE 当然不是必须的， IIFE 最常见的用法是使用一个匿名函数表达式。虽然使
// 用具名函数的 IIFE 并不常见，但它具有上述匿名函数表达式的所有优势，因此也是一个值
// 得推广的实践。


var a = 2;
(function IIFE() {
    var a = 3;
    console.log(a); // 3
})();
console.log(a); // 2

// 函数作用域和块作用域 ｜ 29
// 相较于传统的 IIFE 形式，很多人都更喜欢另一个改进的形式： (function () { ..}()) 。仔
// 细观察其中的区别。第一种形式中函数表达式被包含在() 中，然后在后面用另一个() 括
// 号来调用。第二种形式中用来调用的() 括号被移进了用来包装的() 括号中。
// 这两种形式在功能上是一致的。 选择哪个全凭个人喜好。
// IIFE 的另一个非常普遍的进阶用法是把它们当作函数调用并传递参数进去。
// 例如：


var a = 2;
(function IIFE(global) {
    var a = 3;
    console.log(a); // 3
    console.log(global.a); // 2
})(window);
console.log(a); // 2


// 我们将 window 对象的引用传递进去，但将参数命名为 global，因此在代码风格上对全局
// 对象的引用变得比引用一个没有“全局”字样的变量更加清晰。当然可以从外部作用域传
// 递任何你需要的东西，并将变量命名为任何你觉得合适的名字。这对于改进代码风格是非
// 常有帮助的。
// 这个模式的另外一个应用场景是解决 undefined 标识符的默认值被错误覆盖导致的异常（虽
// 然不常见）。将一个参数命名为 undefined，但是在对应的位置不传入任何值，这样就可以
// 保证在代码块中 undefined 标识符的值真的是 undefined：

undefined = true; // 给其他代码挖了一个大坑！绝对不要这样做！

(function IIFE(undefined) {
    var a;
    if (a === undefined) {
        console.log("Undefined is safe here!");
    }
})();

// IIFE 还有一种变化的用途是倒置代码的运行顺序，将需要运行的函数放在第二位，在 IIFE
// 执行之后当作参数传递进去。这种模式在 UMD（ Universal Module Definition）项目中被广
// 泛使用。尽管这种模式略显冗长，但有些人认为它更易理解。
var a = 2;

(function IIFE(def) {
    def(window);
})(function def(global) {
    var a = 3;
    console.log(a); // 3
    console.log(global.a); // 2
});


// 函数表达式 def 定义在片段的第二部分，然后当作参数（这个参数也叫作 def）被传递进
// IIFE 函数定义的第一部分中。最后，参数 def（也就是传递进去的函数）被调用，并将
// window 传入当作 global 参数的值
// 3.4　块作用域

// 尽管函数作用域是最常见的作用域单元，当然也是现行大多数 JavaScript 中最普遍的设计
// 方法，但其他类型的作用域单元也是存在的，并且通过使用其他类型的作用域单元甚至可
// 以实现维护起来更加优秀、简洁的代码。
// 除 JavaScript 外的很多编程语言都支持块作用域，因此其他语言的开发者对于相关的思维
// 方式会很熟悉，但是对于主要使用 JavaScript 的开发者来说，这个概念会很陌生。
// 尽管你可能连一行带有块作用域风格的代码都没有写过，但对下面这种很常见的 JavaScript
// 代码一定很熟悉：


for (var i = 0; i < 10; i++) {
    console.log(i);
}

// 我们在 for 循环的头部直接定义了变量 i，通常是因为只想在 for 循环内部的上下文中使
// 用 i，而忽略了 i 会被绑定在外部作用域（函数或全局）中的事实。
// 这就是块作用域的用处。变量的声明应该距离使用的地方越近越好，并最大限度地本地
// 化。另外一个例子：

var foo = true;
if (foo) {
    var bar = foo * 2;
    bar = something(bar);
    console.log(bar);
}
// bar 变量仅在 if 声明的上下文中使用，因此如果能将它声明在 if 块内部中会是一个很有
// 意义的事情。但是，当使用 var 声明变量时，它写在哪里都是一样的，因为它们最终都会

// 属于外部作用域。这段代码是为了风格更易读而伪装出的形式上的块作用域，如果使用这
// 种形式，要确保没在作用域其他地方意外地使用 bar 只能依靠自觉性。
// 块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息
// 扩展为在块中隐藏信息。
// 再次考虑 for 循环的例子：
for (var i = 0; i < 10; i++) {
    console.log(i);
}
// 为什么要把一个只在 for 循环内部使用（至少是应该只在内部使用）的变量 i 污染到整个
// 函数作用域中呢？
// 更重要的是，开发者需要检查自己的代码，以避免在作用范围外意外地使用（或复用）某
// 些变量，如果在错误的地方使用变量将导致未知变量的异常。变量 i 的块作用域（如果存
// 在的话）将使得其只能在 for 循环内部使用，如果在函数中其他地方使用会导致错误。这
// 对保证变量不会被混乱地复用及提升代码的可维护性都有很大帮助。
// 但可惜，表面上看 JavaScript 并没有块作用域的相关功能。
// 除非你更加深入地研究。


// 3.4.1 with
// 我们在第 2 章讨论过 with 关键字。它不仅是一个难于理解的结构，同时也是块作用域的一
// 个例子（块作用域的一种形式），用 with 从对象中创建出的作用域仅在 with 声明中而非外
// 部作用域中有效。
// 3.4.2 try/catch
// 非常少有人会注意到 JavaScript 的 ES3 规范中规定 try/catch 的 catch 分句会创建一个块作
// 用域，其中声明的变量仅在 catch 内部有效。
// 例如：
try {
    undefined(); // 执行一个非法操作来强制制造一个异常
}
catch (err) {
    console.log(err); // 能够正常执行！
}
console.log(err); // ReferenceError: err not found



// 3.4.3 let
// 到目前为止，我们知道 JavaScript 在暴露块作用域的功能中有一些奇怪的行为。如果仅仅
// 是这样，那么 JavaScript 开发者多年来也就不会将块作用域当作非常有用的机制来使用了。
// 幸好， ES6 改变了现状，引入了新的 let 关键字，提供了除 var 以外的另一种变量声明方式。
// let 关键字可以将变量绑定到所在的任意作用域中（通常是 { .. } 内部）。换句话说， let
// 为其声明的变量隐式地了所在的块作用域。


var foo = true;
if (foo) {
    let bar = foo * 2;
    bar = something(bar);
    console.log(bar);
}
console.log(bar); // ReferenceError
// 用 let 将变量附加在一个已经存在的块作用域上的行为是隐式的。在开发和修改代码的过
// 程中，如果没有密切关注哪些块作用域中有绑定的变量，并且习惯性地移动这些块或者将
// 其包含在其他的块中，就会导致代码变得混乱。
// 为块作用域显式地创建块可以部分解决这个问题，使变量的附属关系变得更加清晰。通常
// 来讲，显式的代码优于隐式或一些精巧但不清晰的代码。显式的块作用域风格非常容易书
// 写，并且和其他语言中块作用域的工作原理一致：
var foo = true;

if (foo) {
    { // <-- 显式的快
        let bar = foo * 2;
        bar = something(bar);
        console.log(bar);
    }
}
console.log(bar); // ReferenceError
// 只要声明是有效的，在声明中的任意位置都可以使用 { .. } 括号来为 let 创建一个用于绑
// 定的块。在这个例子中，我们在 if 声明内部显式地创建了一个块，如果需要对其进行重
// 构，整个块都可以被方便地移动而不会对外部 if 声明的位置和语义产生任何影响。
// 关于另外一种显式的块作用域表达式的内容，请查看附录 B。
// 在第 4 章，我们会讨论提升，提升是指声明会被视为存在于其所出现的作用域的整个范围内。
// 但是使用 let 进行的声明不会在块作用域中进行提升。声明的代码被运行之前，声明并不
// “存在”。
{
    console.log(bar); // ReferenceError!
    let bar = 2;
}


// 1. 垃圾收集
// 另一个块作用域非常有用的原因和闭包及回收内存垃圾的回收机制相关。这里简要说明一
// 下，而内部的实现原理，也就是闭包的机制会在第 5 章详细解释。
// 考虑以下代码：
function process(data) {
    // 在这里做点有趣的事情
}
var someReallyBigData = { .. };
process(someReallyBigData);
var btn = document.getElementById("my_button");
btn.addEventListener("click", function click(evt) {
    console.log("button clicked");
}, /*capturingPhase=*/false);

// click 函数的点击回调并不需要 someReallyBigData 变量。理论上这意味着当 process(..) 执
// 行后，在内存中占用大量空间的数据结构就可以被垃圾回收了。但是，由于 click 函数形成
// 了一个覆盖整个作用域的闭包， JavaScript 引擎极有可能依然保存着这个结构（取决于具体
// 实现）。
// 块作用域可以打消这种顾虑，可以让引擎清楚地知道没有必要继续保存 someReallyBigData 了：
function process(data) {
    // 在这里做点有趣的事情
}
// 在这个块中定义的内容可以销毁了！
{
    let someReallyBigData = { .. };
    process(someReallyBigData);
}
var btn = document.getElementById("my_button");
btn.addEventListener("click", function click(evt) {
    console.log("button clicked");
}, /*capturingPhase=*/false);
// 为变量显式声明块作用域，并对变量进行本地绑定是非常有用的工具，可以把它添加到你
// 的代码工具箱中了。
// 2. let循环
// 一个 let 可以发挥优势的典型例子就是之前讨论的 for 循环。
for (let i = 0; i < 10; i++) {
    console.log(i);
}
console.log(i); // ReferenceError
// for 循环头部的 let 不仅将 i 绑定到了 for 循环的块中，事实上它将其重新绑定到了循环
// 的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。
// 下面通过另一种方式来说明每次迭代时进行重新绑定的行为：
{
    let j;
    for (j = 0; j < 10; j++) {
        let i = j; // 每个迭代重新绑定！
        console.log(i);
    }
}
// 每个迭代进行重新绑定的原因非常有趣，我们会在第 5 章讨论闭包时进行说明。
// 函数作用域和块作用域 ｜ 35
// 由于 let 声明附属于一个新的作用域而不是当前的函数作用域（也不属于全局作用域），
//     当代码中存在对于函数作用域中 var 声明的隐式依赖时，就会有很多隐藏的陷阱，如果用
// let 来替代 var 则需要在代码重构的过程中付出额外的精力。
//     考虑以下代码：
var foo = true, baz = 10;
if (foo) {
    var bar = 3;
    if (baz > bar) {
        console.log(baz);
    }
    // ...
}
// 这段代码可以简单地被重构成下面的同等形式：
var foo = true, baz = 10;
if (foo) {
    var bar = 3;
    // ...
}
if (baz > bar) {
    console.log(baz);
}
// 但是在使用块级作用域的变量时需要注意以下变化：
var foo = true, baz = 10;
if (foo) {
    let bar = 3;
    if (baz > bar) { // <-- 移动代码时不要忘了 bar!
        console.log(baz);
    }
}
// 参考附录 B，其中介绍了另外一种块作用域形式，可以用更健壮的方式实现目的，并且写
// 出的代码更易维护和重构。
// 3.4.4 const
//     除了 let 以外， ES6 还引入了 const ，同样可以用来创建块作用域变量，但其值是固定的
// （常量）。 之后任何试图修改值的操作都会引起错误。


var foo = true;
if (foo) {
    var a = 2;
    const b = 3; // 包含在 if 中的块作用域常量
    a = 3; // 正常 !
    b = 4; // 错误 !
}
console.log(a); // 3
console.log(b); // ReferenceError
// 3.3.7[[Get]]
// 属性访问在实现时有一个微妙却非常重要的细节，思考下面的代码：

var myObject = {
    a: 2
};
myObject.a; // 2

// myObject.a 是一次属性访问，但是这条语句并不仅仅是在 myObjet 中查找名字为 a 的属性，
// 虽然看起来好像是这样。
// 在语言规范中， myObject.a 在 myObject 上实际上是实现了[[Get]] 操作（有点像函数调
// 用：[[Get]]() ）。对象默认的内置[[Get]] 操作首先在对象中查找是否有名称相同的属性，
// 如果找到就会返回这个属性的值。
// 然而，如果没有找到名称相同的属性，按照[[Get]] 算法的定义会执行另外一种非常重要
// 的行为。我们会在第 5 章中介绍这个行为（其实就是遍历可能存在的[[Prototype]] 链，
// 也就是原型链）。
// 如果无论如何都没有找到名称相同的属性，那[[Get]] 操作会返回值 undefined：
var myObject = {
    a: 2
};
myObject.b; // undefined
// 注意，这种方法和访问变量时是不一样的。如果你引用了一个当前词法作用域中不存在的
// 变量，并不会像对象属性一样返回 undefined，而是会抛出一个 ReferenceError 异常：
var myObject = {
    a: undefined
};
myObject.a; // undefined
// myObject.b; // undefined
// 从返回值的角度来说，这两个引用没有区别——它们都返回了 undefined。然而，尽管乍
// 看之下没什么区别，实际上底层的[[Get]] 操作对 myObject.b 进行了更复杂的处理。
// 由于仅根据返回值无法判断出到底变量的值为 undefined 还是变量不存在，所以[[Get]]
// 操作返回了 undefined。不过稍后我们会介绍如何区分这两种情况。
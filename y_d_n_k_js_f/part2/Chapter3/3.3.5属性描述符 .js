// 3.3.5　属性描述符
// 在 ES5 之前， JavaScript 语言本身并没有提供可以直接检测属性特性的方法，比如判断属
// 性是否是只读。
// 但是从 ES5 开始，所有的属性都具备了属性描述符。
// 思考下面的代码：

var myObject = {
    a: 2
};
Object.getOwnPropertyDescriptor(myObject, "a");
// {
// value: 2,
// writable: true,
// enumerable: true,
// configurable: true
// }

// 如你所见，这个普通的对象属性对应的属性描述符（也被称为“数据描述符”，因为它
// 只保存一个数据值）可不仅仅只是一个 2。它还包含另外三个特性： writable（可写）、
// enumerable（可枚举）和 configurable（可配置）。
// 在创建普通属性时属性描述符会使用默认值，我们也可以使用 Object.defineProperty(..)
// 来添加一个新属性或者修改一个已有属性（如果它是 configurable）并对特性进行设置。
// 举例来说：

var myObject = {};
Object.defineProperty(myObject, "a", {
    value: 2,
    writable: true,
    configurable: true,
    enumerable: true
});
myObject.a; // 2


// 我们使用 defineProperty(..) 给 myObject 添加了一个普通的属性并显式指定了一些特性。
// 然而，一般来说你不会使用这种方式，除非你想修改属性描述符。

// 1. Writable
// writable 决定是否可以修改属性的值。
// 思考下面的代码：

var myObject = {};
Object.defineProperty(myObject, "a", {
    value: 2,
    writable: false, // 不可写！
    configurable: true,
    enumerable: true
});
myObject.a = 3;
myObject.a; // 2


// 如你所见，我们对于属性值的修改静默失败（ silently failed）了。如果在严格模式下，这
// 种方法会出错：

"use strict";
var myObject = {};
Object.defineProperty(myObject, "a", {
    value: 2,
    writable: false, // 不可写！
    configurable: true,
    enumerable: true
});
myObject.a = 3; // TypeError


// TypeError 错误表示我们无法修改一个不可写的属性。
// 之后我们会介绍 getter 和 setter，不过简单来说，你可以把 writable: false 看
// 作是属性不可改变，相当于你定义了一个空操作 setter。严格来说，如果要
// 和 writable: false 一致的话，你的 setter 被调用时应当抛出一个 TypeError
// 错误。

// 2. Configurable
// 只要属性是可配置的，就可以使用 defineProperty(..) 方法来修改属性描述符：
var myObject = {
    a: 2
};
myObject.a = 3;
myObject.a; // 3

Object.defineProperty(myObject, "a", {
    value: 4,
    writable: true,
    configurable: false, // 不可配置！
    enumerable: true
});

myObject.a; // 4
myObject.a = 5;
myObject.a; // 5

Object.defineProperty(myObject, "a", {
    value: 6,
    writable: true,
    configurable: true,
    enumerable: true
}); // TypeError

// 最后一个 defineProperty(..) 会产生一个 TypeError 错误，不管是不是处于严格模式，尝
// 试修改一个不可配置的属性描述符都会出错。注意：如你所见，把 configurable 修改成
// false 是单向操作，无法撤销！
// 要注意有一个小小的例外：即便属性是 configurable: false， 我们还是可以
// 把 writable 的状态由 true 改为 false，但是无法由 false 改为 true。
// 除了无法修改， configurable: false 还会禁止删除这个属性：
// var myObject = {
//     a: 2
// };
myObject.a; // 2
delete myObject.a;
myObject.a; // undefined
Object.defineProperty(myObject, "a", {
    value: 2,
    writable: true,
    configurable: false,
    enumerable: true
});
myObject.a; // 2
delete myObject.a;
myObject.a; // 2

// 如你所见，最后一个 delete 语句（静默）失败了，因为属性是不可配置的。
// 在本例中， delete 只用来直接删除对象的（可删除）属性。如果对象的某个属性是某个
// 对象 / 函数的最后一个引用者，对这个属性执行 delete 操作之后，这个未引用的对象 / 函
// 数就可以被垃圾回收。但是，不要把 delete 看作一个释放内存的工具（就像 C / C++ 中那
// 样）， 它就是一个删除对象属性的操作，仅此而已。
// 3. Enumerable
// 这里我们要介绍的最后一个属性描述符（还有两个，我们会在介绍 getter 和 setter 时提到）
// 是 enumerable。
// 从名字就可以看出，这个描述符控制的是属性是否会出现在对象的属性枚举中，比如说
// for..in 循环。如果把 enumerable 设置成 false，这个属性就不会出现在枚举中，虽然仍
// 然可以正常访问它。相对地，设置成 true 就会让它出现在枚举中。
// 用户定义的所有的普通属性默认都是 enumerable，这通常就是你想要的。但是如果你不希
// 望某些特殊属性出现在枚举中，那就把它设置成 enumerable: false。
// 稍后我们会详细介绍可枚举性，这里先提示一下。
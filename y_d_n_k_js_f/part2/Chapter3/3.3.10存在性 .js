// 3.3.10　存在性
// 前面我们介绍过，如 myObject.a 的属性访问返回值可能是 undefined，但是这个值有可能
// 是属性中存储的 undefined，也可能是因为属性不存在所以返回 undefined。那么如何区分
// 这两种情况呢？
// 我们可以在不访问属性值的情况下判断对象中是否存在这个属性：

var myObject = {
    a: 2
};

("a" in myObject); // true
("b" in myObject); // false
myObject.hasOwnProperty("a"); // true
myObject.hasOwnProperty("b"); // false

// in 操作符会检查属性是否在对象及其[[Prototype]] 原型链中（参见第 5 章）。相比之下，
// hasOwnProperty(..) 只会检查属性是否在 myObject 对象中，不会检查[[Prototype]] 链。
// 在第 5 章讲解[[Prototype]] 时我们会详细介绍这两者的区别。
// 所 有 的 普 通 对 象 都 可 以 通 过 对 于 Object.prototype 的 委 托（ 参 见 第 5 章 ） 来 访 问
// hasOwnProperty(..) ，但是有的对象可能没有连接到 Object.prototype（通过 Object.
//     create(null) 来创建——参见第 5 章）。在这种情况下，形如 myObejct.hasOwnProperty(..)
// 就会失败。
// 这 时 可 以 使 用 一 种 更 加 强 硬 的 方 法 来 进 行 判 断： Object.prototype.hasOwnProperty.
//     call(myObject, "a") ，它借用基础的 hasOwnProperty(..) 方法并把它显式绑定（参见第 2
// 章）到 myObject 上。
// 看起来 in 操作符可以检查容器内是否有某个值，但是它实际上检查的是某
// 个属性名是否存在。对于数组来说这个区别非常重要， 4 in [2, 4, 6] 的结
// 果并不是你期待的 True，因为[2, 4, 6] 这个数组中包含的属性名是 0、 1、
// 2， 没有 4。

// 1. 枚举
// 之前介绍 enumerable 属性描述符特性时我们简单解释过什么是“可枚举性”，现在详细介绍一下：
var myObject = {};
Object.defineProperty(
    myObject,
    "a",
    // 让 a 像普通属性一样可以枚举
    { enumerable: true, value: 2 }
);

Object.defineProperty(
    myObject,
    "b",
    // 让 b 不可枚举
    { enumerable: false, value: 3 }
);
myObject.b; // 3
("b" in myObject); // true
myObject.hasOwnProperty("b"); // true
// .......
for (var k in myObject) {
    console.log(k, myObject[k]);
}
// "a" 2

// 可以看到， myObject.b 确实存在并且有访问值，但是却不会出现在 for..in 循环中（尽管
// 可以通过 in 操作符来判断是否存在）。原因是“可枚举”就相当于“可以出现在对象属性
// 的遍历中”。
// 在数组上应用 for..in 循环有时会产生出人意料的结果，因为这种枚举不
// 仅会包含所有数值索引，还会包含所有可枚举属性。最好只在对象上应用
// for..in 循环，如果要遍历数组就使用传统的 for 循环来遍历数值索引。
// 也可以通过另一种方式来区分属性是否可枚举：

var myObject = {};
Object.defineProperty(
    myObject,
    "a",
    // 让 a 像普通属性一样可以枚举
    { enumerable: true, value: 2 }
);
Object.defineProperty(

    myObject,
    "b",
    // 让 b 不可枚举
    { enumerable: false, value: 3 }
);
myObject.propertyIsEnumerable("a"); // true
myObject.propertyIsEnumerable("b"); // false
Object.keys(myObject); // ["a"]
Object.getOwnPropertyNames(myObject); // ["a", "b"]

// propertyIsEnumerable(..) 会检查给定的属性名是否直接存在于对象中（而不是在原型链
// 上）并且满足 enumerable: true。
// Object.keys(..) 会返回一个数组，包含所有可枚举属性， Object.getOwnPropertyNames(..)
// 会返回一个数组，包含所有属性，无论它们是否可枚举。
// in 和 hasOwnProperty(..) 的区别在于是否查找[[Prototype]] 链，然而， Object.keys(..)
// 和 Object.getOwnPropertyNames(..) 都只会查找对象直接包含的属性。
// （目前）并没有内置的方法可以获取 in 操作符使用的属性列表（对象本身的属性以
// 及[[Prototype]] 链中的所有属性，参见第 5 章）。不过你可以递归遍历某个对象的整条
// [[Prototype]] 链并保存每一层中使用 Object.keys(..) 得到的属性列表——只包含可枚举属性。
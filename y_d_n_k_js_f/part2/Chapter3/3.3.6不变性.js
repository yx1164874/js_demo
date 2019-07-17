// 3.3.6　不变性

// 有时候你会希望属性或者对象是不可改变（无论有意还是无意）的，在 ES5 中可以通过很
// 多种方法来实现。
// 很重要的一点是， 所有的方法创建的都是浅不变形，也就是说，它们只会影响目标对象和
// 它的直接属性。如果目标对象引用了其他对象（数组、对象、函数，等），其他对象的内
// 容不受影响，仍然是可变的：
// myImmutableObject.foo; // [1,2,3]
// myImmutableObject.foo.push(4);
// myImmutableObject.foo; // [1,2,3,4]
// 假设代码中的 myImmutableObject 已经被创建而且是不可变的，但是为了保护它的内容
// myImmutableObject.foo，你还需要使用下面的方法让 foo 也不可变。
// 在 JavaScript 程序中很少需要深不可变性。有些特殊情况可能需要这样做，
// 但是根据通用的设计模式，如果你发现需要密封或者冻结所有的对象，那
// 你或许应当退一步，重新思考一下程序的设计，让它能更好地应对对象值
// 的改变。
// 1. 对象常量
// 结合 writable: false 和 configurable: false 就可以创建一个真正的常量属性（不可修改、
// 重定义或者删除）：

var myObject = {};
Object.defineProperty(myObject, "FAVORITE_NUMBER", {
    value: 42,
    writable: false,
    configurable: false
});

// 2. 禁止扩展
// 如 果 你 想 禁 止 一 个 对 象 添 加 新 属 性 并 且 保 留 已 有 属 性， 可 以 使 用 Object.prevent
// Extensions(..) ：

var myObject = {
    a: 2
};

Object.preventExtensions(myObject);
myObject.b = 3;
myObject.b; // undefined

// 在非严格模式下，创建属性 b 会静默失败。在严格模式下，将会抛出 TypeError 错误。

// 3. 密封
// Object.seal(..) 会创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用
// Object.preventExtensions(..) 并把所有现有属性标记为 configurable: false。
// 所以，密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性（虽然可以
// 修改属性的值）。

// 4. 冻结
// Object.freeze(..) 会创建一个冻结对象，这个方法实际上会在一个现有对象上调用
// Object.seal(..) 并把所有“数据访问”属性标记为 writable: false，这样就无法修改它们
// 的值。
// 这个方法是你可以应用在对象上的级别最高的不可变性，它会禁止对于对象本身及其任意
// 直接属性的修改（不过就像我们之前说过的，这个对象引用的其他对象是不受影响的）。
// 你可以“深度冻结”一个对象，具体方法为，首先在这个对象上调用 Object.freeze(..) ，
// 然后遍历它引用的所有对象并在这些对象上调用 Object.freeze(..) 。但是一定要小心，因
// 为这样做有可能会在无意中冻结其他（共享）对象。
// 5.4　对象关联
// 现在我们知道了，[[Prototype]] 机制就是存在于对象中的一个内部链接，它会引用其他
// 对象。
// 通常来说，这个链接的作用是：如果在对象上没有找到需要的属性或者方法引用，引擎就
// 会继续在[[Prototype]] 关联的对象上进行查找。同理，如果在后者中也没有找到需要的
// 引用就会继续查找它的[[Prototype]]，以此类推。这一系列对象的链接被称为“原型链”。

// 5.4.1　创建关联
// 我们已经明白了为什么 JavaScript 的[[Prototype]] 机制和类不一样，也明白了它如何建立
// 对象间的关联。
// 那[[Prototype]] 机制的意义是什么呢？为什么 JavaScript 开发者费这么大的力气（模拟
// 类）在代码中创建这些关联呢？
// 还记得吗，本章前面曾经说过 Object.create(..) 是一个大英雄，现在是时候来弄明白为
// 什么了：

var foo = {
    something: function () {
        console.log("Tell me something good...");
    }
};
var bar = Object.create(foo);
bar.something(); // Tell me something good...

// Object.create(..) 会创建一个新对象（ bar）并把它关联到我们指定的对象（ foo），这样
// 我们就可以充分发挥[[Prototype]] 机制的威力（委托）并且避免不必要的麻烦（比如使
// 用 new 的构造函数调用会生成.prototype 和.constructor 引用）。
// Object.create(null) 会 创 建 一 个 拥 有 空（ 或 者 说 null）[[Prototype]]
// 链接的对象，这个对象无法进行委托。由于这个对象没有原型链，所以
//     instanceof 操作符（之前解释过）无法进行判断，因此总是会返回 false。
// 这些特殊的空[[Prototype]] 对象通常被称作“字典”，它们完全不会受到原
// 型链的干扰，因此非常适合用来存储数据。
// 我们并不需要类来创建两个对象之间的关系，只需要通过委托来关联对象就足够了。而
// Object.create(..) 不包含任何“类的诡计”，所以它可以完美地创建我们想要的关联关系。

// Object.create()的polyfill代码
// Object.create(..) 是在 ES5 中新增的函数，所以在 ES5 之前的环境中（比如旧 IE）如
// 果要支持这个功能的话就需要使用一段简单的 polyfill 代码，它部分实现了 Object.
//     create(..) 的功能：
// if (!Object.create) {
//     Object.create = function (o) {
//         function F() { }
//         F.prototype = o;
//         return new F();
//     };
// }

// 这段 polyfill 代码使用了一个一次性函数 F，我们通过改写它的.prototype 属性使其指向想
// 要关联的对象，然后再使用 new F() 来构造一个新对象进行关联。
// 由于 Object.create(..c) 可以被模拟，因此这个函数被应用得非常广泛。标准 ES5 中内
// 置的 Object.create(..) 函数还提供了一系列附加功能，但是 ES5 之前的版本不支持这些
// 功能。通常来说，这些功能的应用范围要小得多，但是出于完整性考虑，我们还是介绍一
// 下：

var anotherObject = {
    a: 2
};
var myObject = Object.create(anotherObject, {
    b: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: 3
    },
    c: {
        enumerable: true,
        writable: false,
        configurable: false,
        value: 4
    }
});
myObject.hasOwnProperty("a"); // false
myObject.hasOwnProperty("b"); // true
myObject.hasOwnProperty("c"); // true
myObject.a; // 2
myObject.b; // 3
myObject.c; // 4

// Object.create(..) 的第二个参数指定了需要添加到新对象中的属性名以及这些属性的属性

// 描述符（参见第 3 章）。因为 ES5 之前的版本无法模拟属性操作符，所以 polyfill 代码无法
// 实现这个附加功能。
// 通常来说并不会使用 Object.create(..) 的附加功能，所以对于大多数开发者来说，上面
// 那段 polyfill 代码就足够了。
// 有些开发者更加严谨，他们认为只有能被完全模拟的函数才应该使用 polyfill 代码。由于
// Object.create(..) 是只能部分模拟的函数之一，所以这些狭隘的人认为如果你需要在 ES5
// 之前的环境中使用 Object.create(..) 的特性，那不要使用 polyfill 代码，而是使用一个自
// 定义函数并且名字不能是 Object.create。你可以把你自己的函数定义成这样：

function createAndLinkObject(o) {
    function F() { }
    F.prototype = o;
    return new F();
}
var anotherObject = {
    a: 2
};
var myObject = createAndLinkObject(anotherObject);
myObject.a; // 2

// 我并不赞同这个严格的观点，相反，我很赞同在 ES5 中使用上面那段 polyfill 代码。如何
// 选择取决于你。

// 5.4.2　关联关系是备用
// 看起来对象之间的关联关系是处理“缺失”属性或者方法时的一种备用选项。这个说法有
// 点道理，但是我认为这并不是[[Prototype]] 的本质。
// 思考下面的代码：

var anotherObject = {
    cool: function () {
        console.log("cool!");
    }
};
var myObject = Object.create(anotherObject);
myObject.cool(); // "cool!"

// 由于存在[[Prototype]] 机制，这段代码可以正常工作。但是如果你这样写只是为了让
// myObject 在无法处理属性或者方法时可以使用备用的 anotherObject，那么你的软件就会

// 变得有点“神奇”，而且很难理解和维护。
// 这并不是说任何情况下都不应该选择备用这种设计模式，但是这在 JavaScript 中并不是很
// 常见。所以如果你使用的是这种模式，那或许应当退后一步并重新思考一下这种模式是否
// 合适。
// 在 ES6 中有一个被称为“代理”（ Proxy）的高端功能，它实现的就是“方法
// 无法找到”时的行为。代理超出了本书的讨论范围，但是在本系列之后的书
// 中会介绍。
// 千万不要忽略这个微妙但是非常重要的区别。
// 当你给开发者设计软件时，假设要调用 myObject.cool() ，如果 myObject 中不存在 cool()
// 时这条语句也可以正常工作的话，那你的 API 设计就会变得很“神奇”，对于未来维护你
// 软件的开发者来说这可能不太好理解。
// 但是你可以让你的 API 设计不那么“神奇”，同时仍然能发挥[[Prototype]] 关联的威力：

var anotherObject = {
    cool: function () {
        console.log("cool!");
    }
};
var myObject = Object.create(anotherObject);
myObject.doCool = function () {
    this.cool(); // 内部委托！
};
myObject.doCool(); // "cool!"

// 这里我们调用的 myObject.doCool() 是实际存在于 myObject 中的，这可以让我们的 API 设
// 计更加清晰（不那么“神奇”）。从内部来说，我们的实现遵循的是委托设计模式（参见第
// 6 章），通过[[Prototype]] 委托到 anotherObject.cool() 。
// 换句话说，内部委托比起直接委托可以让 API 接口设计更加清晰。下一章我们会详细解释
// 委托。
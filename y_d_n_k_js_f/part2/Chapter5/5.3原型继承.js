// 5.3 （ 原型） 继承
// 我们已经看过了许多 JavaScript 程序中常用的模拟类行为的方法，但是如果没有“继承”
// 机制的话， JavaScript 中的类就只是一个空架子。
// 实际上，我们已经了解了通常被称作原型继承的机制， a 可以“继承” Foo.prototype 并访
// 问 Foo.prototype 的 myName() 函数。但是之前我们只把继承看作是类和类之间的关系，并
// 没有把它看作是类和实例之间的关系：
// 还记得这张图吗，它不仅展示出对象（实例） a1 到 Foo.prototype 的委托关系，还展示出
// Bar.prototype 到 Foo.prototype 的委托关系，而后者和类继承很相似，只有箭头的方向不
// 同。图中由下到上的箭头表明这是委托关联，不是复制操作。
// 下面这段代码使用的就是典型的“原型风格”：

function Foo(name) {
    this.name = name;
}
Foo.prototype.myName = function () {
    return this.name;
};
function Bar(name, label) {
    Foo.call(this, name);
    this.label = label;
}
// 我们创建了一个新的 Bar.prototype 对象并关联到 Foo.prototype
Bar.prototype = Object.create(Foo.prototype);
// 注意！现在没有 Bar.prototype.constructor 了
// 如果你需要这个属性的话可能需要手动修复一下它
Bar.prototype.myLabel = function () {
    return this.label;
};
var a = new Bar("a", "obj a");
a.myName(); // "a"
a.myLabel(); // "obj a"

// 如果不明白为什么 this 指向 a 的话，请查看第 2 章。
// 这段代码的核心部分就是语句 Bar.prototype = Object.create(Foo.prototype) 。调用
// Object.create(..) 会凭空创建一个“新”对象并把新对象内部的[[Prototype]] 关联到你
// 指定的对象（本例中是 Foo.prototype）。
// 换句话说，这条语句的意思是：“创建一个新的 Bar.prototype 对象并把它关联到 Foo.
//     prototype”。
// 声明 function Bar() { ..} 时，和其他函数一样， Bar 会有一个.prototype 关联到默认的
// 对象，但是这个对象并不是我们想要的 Foo.prototype。因此我们创建了一个新对象并把

// 它关联到我们希望的对象上，直接把原始的关联对象抛弃掉。
// 注意，下面这两种方式是常见的错误做法，实际上它们都存在一些问题：

// 和你想要的机制不一样！
Bar.prototype = Foo.prototype;
// 基本上满足你的需求，但是可能会产生一些副作用 :(
Bar.prototype = new Foo();

// Bar.prototype = Foo.prototype 并不会创建一个关联到 Bar.prototype 的新对象，它只
// 是让 Bar.prototype 直接引用 Foo.prototype 对象。因此当你执行类似 Bar.prototype.
//     myLabel = ...的赋值语句时会直接修改 Foo.prototype 对象本身。显然这不是你想要的结
// 果，否则你根本不需要 Bar 对象，直接使用 Foo 就可以了，这样代码也会更简单一些。
// Bar.prototype = new Foo() 的确会创建一个关联到 Bar.prototype 的新对象。但是它使用
// 了 Foo(..) 的“构造函数调用”，如果函数 Foo 有一些副作用（比如写日志、修改状态、注
// 册到其他对象、给 this 添加数据属性，等等）的话，就会影响到 Bar() 的“后代”，后果
// 不堪设想。
// 因此，要创建一个合适的关联对象，我们必须使用 Object.create(..) 而不是使用具有副
// 作用的 Foo(..) 。这样做唯一的缺点就是需要创建一个新对象然后把旧对象抛弃掉，不能
// 直接修改已有的默认对象。
// 如果能有一个标准并且可靠的方法来修改对象的[[Prototype]] 关联就好了。在 ES6 之前，
// 我们只能通过设置.__proto__ 属性来实现，但是这个方法并不是标准并且无法兼容所有浏
// 览器。 ES6 添加了辅助函数 Object.setPrototypeOf(..) ，可以用标准并且可靠的方法来修
// 改关联。
// 我们来对比一下两种把 Bar.prototype 关联到 Foo.prototype 的方法：

// ES6 之前需要抛弃默认的 Bar.prototype
Bar.ptototype = Object.create(Foo.prototype);
// ES6 开始可以直接修改现有的 Bar.prototype
Object.setPrototypeOf(Bar.prototype, Foo.prototype);

// 如果忽略掉 Object.create(..) 方法带来的轻微性能损失（抛弃的对象需要进行垃圾回
// 收），它实际上比 ES6 及其之后的方法更短而且可读性更高。不过无论如何，这是两种完
// 全不同的语法。
// 检查“类”关系
// 假设有对象 a，如何寻找对象 a 委托的对象（如果存在的话）呢？在传统的面向类环境中，

// 检查一个实例（ JavaScript 中的对象）的继承祖先（ JavaScript 中的委托关联）通常被称为
// 内省（或者反射）。
// 思考下面的代码：

function Foo() {
    // ...
}
Foo.prototype.blah = ...;
var a = new Foo();

// 我们如何通过内省找出 a 的“祖先”（委托关联）呢？第一种方法是站在“类”的角度来
// 判断：
// a instanceof Foo; // true
// instanceof 操作符的左操作数是一个普通的对象，右操作数是一个函数。 instanceof 回答

// 的问题是：在 a 的整条[[Prototype]] 链中是否有指向 Foo.prototype 的对象？

// 可惜，这个方法只能处理对象（ a）和函数（带.prototype 引用的 Foo）之间的关系。如
// 果你想判断两个对象（比如 a 和 b）之间是否通过[[Prototype]] 链关联，只用 instanceof
//     无法实现。
// 如果使用内置的.bind(..) 函数来生成一个硬绑定函数（参见第 2 章）的话，
// 该函数是没有.prototype 属性的。在这样的函数上使用 instanceof 的话，
// 目标函数的.prototype 会代替硬绑定函数的.prototype。
// 通常我们不会在“构造函数调用”中使用硬绑定函数，不过如果你这么
// 做的话，实际上相当于直接调用目标函数。同理，在硬绑定函数上使用
//     instanceof 也相当于直接在目标函数上使用 instanceof。
// 下面这段荒谬的代码试图站在“类”的角度使用 instanceof 来判断两个对象的关系：

// 用来判断 o1 是否关联到（委托） o2 的辅助函数
function isRelatedTo(o1, o2) {
    function F() { }
    F.prototype = o2;
    return o1 instanceof F;
}
var a = {};
var b = Object.create(a);
isRelatedTo(b, a); // true


// 在 isRelatedTo(..) 内部我们声明了一个一次性函数 F，把它的.prototype 重新赋值并指
// 向对象 o2，然后判断 o1 是否是 F 的一个“实例”。显而易见， o1 实际上并没有继承 F 也不
// 是由 F 构造，所以这种方法非常愚蠢并且容易造成误解。问题的关键在于思考的角度，强
// 行在 JavaScript 中应用类的语义（在本例中就是使用 instanceof）就会造成这种尴尬的局
// 面。
// 下面是第二种判断[[Prototype]] 反射的方法，它更加简洁：
// Foo.prototype.isPrototypeOf(a); // true
// 注意，在本例中，我们实际上并不关心（甚至不需要） Foo，我们只需要一个可以用来判
// 断的对象（本例中是 Foo.prototype）就行。 isPrototypeOf(..) 回答的问题是：在 a 的整
// 条[[Prototype]] 链中是否出现过 Foo.prototype ？

// 同样的问题，同样的答案，但是在第二种方法中并不需要间接引用函数（ Foo），它
// 的.prototype 属性会被自动访问。
// 我们只需要两个对象就可以判断它们之间的关系。举例来说：
// 非常简单： b 是否出现在 c 的 [[Prototype]] 链中？

b.isPrototypeOf(c);

// 注意，这个方法并不需要使用函数（“类”），它直接使用 b 和 c 之间的对象引用来判断它
// 们的关系。换句话说，语言内置的 isPrototypeOf(..) 函数就是我们的 isRelatedTo(..) 函
// 数。
// 我们也可以直接获取一个对象的[[Prototype]] 链。在 ES5 中，标准的方法是：
// Object.getPrototypeOf(a);
// 可以验证一下，这个对象引用是否和我们想的一样：
// Object.getPrototypeOf(a) === Foo.prototype; // true
// 绝大多数（不是所有！）浏览器也支持一种非标准的方法来访问内部[[Prototype]] 属性：
// a.__proto__ === Foo.prototype; // true
// 这个奇怪的.__proto__（在 ES6 之前并不是标准！）属性“神奇地”引用了内部的
// [[Prototype]] 对象，如果你想直接查找（甚至可以通过.__proto__.__ptoto__...来遍历）
// 原型链的话，这个方法非常有用。
// 和我们之前说过的.constructor 一样， .__proto__ 实际上并不存在于你正在使用的对象中
// （本例中是 a）。实际上，它和其他的常用函数（ .toString() 、 .isPrototypeOf(..) ，等等）

// 一样，存在于内置的 Object.prototype 中。（它们是不可枚举的，参见第 2 章。）
// 此外， .__proto__ 看起来很像一个属性，但是实际上它更像一个 getter / setter（参见第 3
// 章）。
// .__proto__ 的实现大致上是这样的（对象属性的定义参见第 3 章）：

Object.defineProperty(Object.prototype, "__proto__", {
    get: function () {
        return Object.getPrototypeOf(this);
    },
    set: function (o) {
        // ES6 中的 setPrototypeOf(..)
        Object.setPrototypeOf(this, o);
        return o;
    }
});

// 因此，访问（获取值） a.__proto__ 时，实际上是调用了 a.__proto__() （调用 getter 函
// 数）。虽然 getter 函数存在于 Object.prototype 对象中，但是它的 this 指向对象 a（ this
// 的绑定规则参见第 2 章），所以和 Object.getPrototypeOf(a) 结果相同。
// .__proto__ 是可设置属性，之前的代码中使用 ES6 的 Object.setPrototypeOf(..) 进行设
// 置。然而，通常来说你不需要修改已有对象的[[Prototype]]。
// 一些框架会使用非常复杂和高端的技术来实现“子类”机制，但是通常来说，我们不推荐
// 这种用法，因为这会极大地增加代码的阅读难度和维护难度。
// ES6 中的 class 关键字可以在内置的类型（比如 Array）上实现类似“子类”
// 的功能。详情参考附录 A 中关于 ES6 中 class 语法的介绍。
// 我们只有在一些特殊情况下（我们前面讨论过）需要设置函数默认.prototype 对象的
// [[Prototype]]，让它引用其他对象（除了 Object.prototype）。这样可以避免使用全新的
// 对象替换默认对象。此外，最好把[[Prototype]] 对象关联看作是只读特性，从而增加代
// 码的可读性。
// JavaScript 社区中对于双下划线有一个非官方的称呼，他们会把类似 __proto__
// 的属性称为“笨蛋（ dunder）”。所以， JavaScript 潮人会把 __proto__ 叫作
// “笨蛋 proto”。
// 3.3.4　复制对象
// JavaScript 初学者最常见的问题之一就是如何复制一个对象。看起来应该有一个内置的 copy()
// 方法，是吧？实际上事情比你想象的更复杂，因为我们无法选择一个默认的复制算法。
// 举例来说，思考一下这个对象：

function anotherFunction() { /*..*/ }
var anotherObject = {
    c: true
};
var anotherArray = [];
var myObject = {
    a: 2,
    b: anotherObject, // 引用，不是复本！
    c: anotherArray, // 另一个引用！
    d: anotherFunction
};

// anotherArray.push(anotherObject, myObject);
// 如何准确地表示 myObject 的复制呢？
// 首先，我们应该判断它是浅复制还是深复制。对于浅拷贝来说，复制出的新对象中 a 的值会
// 复制旧对象中 a 的值，也就是 2，但是新对象中 b、 c、 d 三个属性其实只是三个引用，它们
// 和旧对象中 b、 c、 d 引用的对象是一样的。对于深复制来说，除了复制 myObject 以外还会复
// 制 anotherObject 和 anotherArray。这时问题就来了， anotherArray 引用了 anotherObject 和
// myObject，所以又需要复制 myObject，这样就会由于循环引用导致死循环。
// 我们是应该检测循环引用并终止循环（不复制深层元素）？还是应当直接报错或者是选择
// 其他方法？
// 除此之外，我们还不确定“复制”一个函数意味着什么。有些人会通过 toString() 来序列
// 化一个函数的源代码（但是结果取决于 JavaScript 的具体实现，而且不同的引擎对于不同
// 类型的函数处理方式并不完全相同）。
// 那么如何解决这些棘手问题呢？许多 JavaScript 框架都提出了自己的解决办法，但是
// JavaScript 应当采用哪种方法作为标准呢？在很长一段时间里，这个问题都没有明确的答案。
// 对于 JSON 安全（也就是说可以被序列化为一个 JSON 字符串并且可以根据这个字符串解
// 析出一个结构和值完全一样的对象）的对象来说，有一种巧妙的复制方法：
// var newObj = JSON.parse(JSON.stringify(someObj));
// 当然，这种方法需要保证对象是 JSON 安全的，所以只适用于部分情况。
// 相比深复制，浅复制非常易懂并且问题要少得多，所以 ES6 定义了 Object.assign(..) 方
// 法来实现浅复制。 Object.assign(..) 方法的第一个参数是目标对象，之后还可以跟一个
// 或多个源对象。它会遍历一个或多个源对象的所有可枚举（ enumerable，参见下面的代码）
// 的自有键（ owned key，很快会介绍）并把它们复制（使用 = 操作符赋值）到目标对象，最
// 后返回目标对象，就像这样：

var newObj = Object.assign({}, myObject);
newObj.a; // 2
newObj.b === anotherObject; // true
newObj.c === anotherArray; // true
newObj.d === anotherFunction; // true

// 下一节会介绍“属性描述符”以及 Object.defineProperty(..) 的用法。但是
// 需要注意的一点是，由于 Object.assign(..) 就是使用 = 操作符来赋值，所
// 以源对象属性的一些特性（比如 writable）不会被复制到目标对象。
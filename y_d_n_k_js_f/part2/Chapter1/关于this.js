// this 关键字是 JavaScript 中最复杂的机制之一。它是一个很特别的关键字，被自动定义在
// 所有函数的作用域中。但是即使是非常有经验的 JavaScript 开发者也很难说清它到底指向
// 什么。
// 任何足够先进的技术都和魔法无异。
// ——Arthur C.Clarke
// 实际上， JavaScript 中 this 的机制并没有那么先进，但是开发者往往会把理解过程复杂化，
// 毫无疑问，在缺乏清晰认识的情况下， this 对你来说完全就是一种魔法。
// “ this”是沟通过程中极其常见的一个代词。所以，在交流过程中很难区分
// 我们到底把“ this”当作代词还是当作关键字。清晰起见，我总一直使用
// this 表示关键字，使用“ this”或者 this 来表示代词。
// 1.1　为什么要用this
// 如果对于有经验的 JavaScript 开发者来说 this 都是一种非常复杂的机制，那它到底有用在
// 哪里呢？真的值得我们付出这么大的代价学习吗？的确，在介绍怎么做之前我们需要先明
// 白为什么。
// 下面我们来解释一下为什么要使用 this：


function identify() {
    return this.name.toUpperCase();
}

function speak() {
    var greeting = "Hello, I'm " + identify.call(this);
    console.log(greeting);
}

var me = {
    name: "Kyle"
};

var you = {
    name: "Reader"
};

identify.call(me); // KYLE
identify.call(you); // READER
speak.call(me); // Hello, 我是 KYLE
speak.call(you); // Hello, 我是 READER

// 看不懂这段代码？不用担心！我们很快就会讲解。现在请暂时抛开这些问题，专注于为
// 什么。
// 这段代码可以在不同的上下文对象（ me 和 you）中重复使用函数 identify() 和 speak() ，
// 不用针对每个对象编写不同版本的函数。
// 如果不使用 this，那就需要给 identify() 和 speak() 显式传入一个上下文对象。

function identify(context) {
    return context.name.toUpperCase();
}


function speak(context) {
    var greeting = "Hello, I'm " + identify(context);
    console.log(greeting);
}


identify(you); // READER
speak(me); //hello, 我是 KYLE

// 然而， this 提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将 API 设计
// 得更加简洁并且易于复用。
// 随着你的使用模式越来越复杂，显式传递上下文对象会让代码变得越来越混乱，使用 this
// 则不会这样。当我们介绍对象和原型时，你就会明白函数可以自动引用合适的上下文对象
// 有多重要。
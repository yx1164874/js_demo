// 3.4　遍历
// for..in 循环可以用来遍历对象的可枚举属性列表（包括[[Prototype]] 链）。但是如何遍
// 历属性的值呢？
// 对于数值索引的数组来说，可以使用标准的 for 循环来遍历值：

var myArray = [1, 2, 3];
for (var i = 0; i < myArray.length; i++) {
    console.log(myArray[i]);
}
// 1 2 3

// 这实际上并不是在遍历值，而是遍历下标来指向值，如 myArray[i]。
// ES5 中增加了一些数组的辅助迭代器，包括 forEach(..) 、 every(..) 和 some(..) 。每种辅
// 助迭代器都可以接受一个回调函数并把它应用到数组的每个元素上，唯一的区别就是它们
// 对于回调函数返回值的处理方式不同。
// forEach(..) 会遍历数组中的所有值并忽略回调函数的返回值。 every(..) 会一直运行直到

// 回调函数返回 false（或者“假”值）， some(..) 会一直运行直到回调函数返回 true（或者
// “真”值）。
// every(..) 和 some(..) 中特殊的返回值和普通 for 循环中的 break 语句类似，它们会提前
// 终止遍历。
// 使用 for..in 遍历对象是无法直接获取属性值的，因为它实际上遍历的是对象中的所有可
// 枚举属性，你需要手动获取属性值。
// 遍历数组下标时采用的是数字顺序（ for 循环或者其他迭代器），但是遍历对
// 象属性时的顺序是不确定的，在不同的 JavaScript 引擎中可能不一样。因此，
// 在不同的环境中需要保证一致性时，一定不要相信任何观察到的顺序，它们
// 是不可靠的。
// 那么如何直接遍历值而不是数组下标（或者对象属性）呢？幸好， ES6 增加了一种用来遍
// 历数组的 for..of 循环语法（如果对象本身定义了迭代器的话也可以遍历对象）：

var myArray = [1, 2, 3];
for (var v of myArray) {
    console.log(v);
}
// 1
// 2
// 3
// for..of 循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的
// next() 方法来遍历所有返回值。
// 数组有内置的 @@iterator，因此 for..of 可以直接应用在数组上。我们使用内置的 @@
// iterator 来手动遍历数组，看看它是怎么工作的：
var myArray = [1, 2, 3];
var it = myArray[Symbol.iterator]();
it.next(); // { value:1, done:false }
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { done:true }

// 我们使用 ES6 中的符号 Symbol.iterator 来获取对象的 @@iterator 内部属
// 性。之前我们简单介绍过符号（ Symbol，参见 3.3.1 节），跟这里的原理是相
// 同的。引用类似 iterator 的特殊属性时要使用符号名，而不是符号包含的
// 值。此外，虽然看起来很像一个对象，但是 @@iterator 本身并不是一个迭代
// 器对象，而是一个返回迭代器对象的函数——这点非常精妙并且非常重要。

// 如你所见，调用迭代器的 next() 方法会返回形式为 { value: .. , done: ..} 的值，
// value 是当前的遍历值， done 是一个布尔值，表示是否还有可以遍历的值。
// 注意，和值“ 3”一起返回的是 done: false，乍一看好像很奇怪，你必须再调用一次
// next() 才能得到 done: true，从而确定完成遍历。这个机制和 ES6 中发生器函数的语义相
// 关，不过已经超出了我们的讨论范围。
// 和数组不同，普通的对象没有内置的 @@iterator，所以无法自动完成 for..of 遍历。之所
// 以要这样做，有许多非常复杂的原因，不过简单来说，这样做是为了避免影响未来的对象
// 类型。
// 当然，你可以给任何想遍历的对象定义 @@iterator，举例来说：

var myObject = {
    a: 2,
    b: 3
};

Object.defineProperty(myObject, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function () {
        var o = this;
        var idx = 0;
        var ks = Object.keys(o);
        return {
            next: function () {
                return {
                    value: o[ks[idx++]],
                    done: (idx > ks.length)
                };
            }
        };
    }
});
// 手动遍历 myObject
var it = myObject[Symbol.iterator]();
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { value:undefined, done:true }
// 用 for..of 遍历 myObject
for (var v of myObject) {
    console.log(v);
}
// 2
// 3

// 我们使用 Object.defineProperty(..) 定义了我们自己的 @@iterator（主要是
// 为了让它不可枚举），不过注意，我们把符号当作可计算属性名（本章之前
// 有介绍）。 此外，也可以直接在定义对象时进行声明，比如 var myObject = {
//     a: 2, b: 3, [Symbol.iterator]: function () { /* .. */ }
// }。
// for..of 循环每次调用 myObject 迭代器对象的 next() 方法时，内部的指针都会向前移动并
// 返回对象属性列表的下一个值（再次提醒，需要注意遍历对象属性 / 值时的顺序）。
// 代码中的遍历非常简单，只是传递了属性本身的值。不过只要你愿意，当然也可以在自定
// 义的数据结构上实现各种复杂的遍历。对于用户定义的对象来说，结合 for..of 循环和自
// 定义迭代器可以组成非常强大的对象操作工具。
// 比如说，一个 Pixel 对象（有 x 和 y 坐标值）列表可以按照距离原点的直线距离来决定遍
// 历顺序，也可以过滤掉“太远”的点，等等。只要迭代器的 next() 调用会返回 {
//     value:
// .. } 和 { done: true } ， ES6 中的 for..of 就可以遍历它。
// 实际上，你甚至可以定义一个“无限”迭代器，它永远不会“结束”并且总会返回一个新
// 值（比如随机数、递增值、唯一标识符，等等）。你可能永远不会在 for..of 循环中使用这
// 样的迭代器，因为它永远不会结束，你的程序会被挂起：

var randoms = {
    [Symbol.iterator]: function () {
        return {
            next: function () {
                return { value: Math.random() };
            }
        };
    }
};
var randoms_pool = [];
for (var n of randoms) {
    randoms_pool.push(n);
    // 防止无限运行！
    if (randoms_pool.length === 100) break;
}
// 这个迭代器会生成“无限个”随机数，因此我们添加了一条 break 语句，防止程序被挂起。
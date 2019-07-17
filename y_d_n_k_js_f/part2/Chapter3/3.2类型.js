// 3.2　类型
// 对象是 JavaScript 的基础。在 JavaScript 中一共有六种主要类型（术语是“语言类型”）：
// • string
// • number
// • boolean
// • null
// • undefined
// • object

// 注意， 简单基本类型（ string、 boolean、 number、 null 和 undefined）本身并不是对象。
// null 有时会被当作一种对象类型，但是这其实只是语言本身的一个 bug，即对 null 执行
// typeof null 时会返回字符串 "object"。 1 实际上， null 本身是基本类型。
// 有一种常见的错误说法是“ JavaScript 中万物皆是对象”，这显然是错误的。
// 实际上， JavaScript 中有许多特殊的对象子类型，我们可以称之为复杂基本类型。
// 函数就是对象的一个子类型（从技术角度来说就是“可调用的对象”）。 JavaScript 中的函
// 数是“一等公民”，因为它们本质上和普通的对象一样（只是可以调用），所以可以像操作
// 其他对象一样操作函数（比如当作另一个函数的参数）。
// 数组也是对象的一种类型，具备一些额外的行为。数组中内容的组织方式比一般的对象要
// 稍微复杂一些。
// 内置对象

// JavaScript 中还有一些对象子类型，通常被称为内置对象。有些内置对象的名字看起来和
// 简单基础类型一样，不过实际上它们的关系更复杂，我们稍后会详细介绍。
// • String
// • Number
// • Boolean
// • Object
// • Function
// • Array
// 注 1： 原理是这样的，不同的对象在底层都表示为二进制，在 JavaScript 中二进制前三位都为 0 的话会被判
// 断为 object 类型， null 的二进制表示是全 0，自然前三位也是 0，所以执行 typeof 时会返回“ object”。
// ——译者注


// • Date
// • RegExp
// • Error

// 这些内置对象从表现形式来说很像其他语言中的类型（ type）或者类（ class），比如 Java
// 中的 String 类。
// 但是在 JavaScript 中，它们实际上只是一些内置函数。这些内置函数可以当作构造函数
// （由 new 产生的函数调用——参见第 2 章）来使用，从而可以构造一个对应子类型的新对
// 象。

var strPrimitive = "I am a string";
typeof strPrimitive; // "string"
strPrimitive instanceof String; // false
Object.prototype.toString.call(strPrimitive)

var strObject = new String("I am a string");//内置对象
typeof strObject; // "object"
strObject instanceof String; // true
// 检查 sub-type 对象
Object.prototype.toString.call(strObject); // [object String]


// 在之后的章节中我们会详细介绍 Object.prototype.toString... 是如何工作的，不过简单
// 来说，我们可以认为子类型在内部借用了 Object 中的 toString() 方法。从代码中可以看
// 到， strObject 是由 String 构造函数创建的一个对象。
// 原始值 "I am a string" 并不是一个对象，它只是一个字面量，并且是一个不可变的值。
// 如果要在这个字面量上执行一些操作，比如获取长度、访问其中某个字符等，那需要将其
// 转换为 String 对象。
// 幸好，在必要时语言会自动把字符串字面量转换成一个 String 对象，也就是说你并不需要
// 显式创建一个对象。 JavaScript 社区中的大多数人都认为能使用文字形式时就不要使用构
// 造形式。
// 思考下面的代码：

var strPrimitive = "I am a string";
console.log(strPrimitive.length); // 13
console.log(strPrimitive.charAt(3)); // "m"

// 使用以上两种方法，我们都可以直接在字符串字面量上访问属性或者方法，之所以可以这
// 样做，是因为引擎自动把字面量转换成 String 对象，所以可以访问属性和方法。
// 同样的事也会发生在数值字面量上，如果使用类似 42.359.toFixed(2) 的方法，引擎会把

// 42 转换成 new Number(42)。对于布尔字面量来说也是如此。
// null 和 undefined 没有对应的构造形式，它们只有文字形式。相反， Date 只有构造，没有
// 文字形式。
// 对于 Object、 Array、 Function 和 RegExp（正则表达式）来说，无论使用文字形式还是构
// 造形式，它们都是对象，不是字面量。在某些情况下，相比用文字形式创建对象，构造形
// 式可以提供一些额外选项。由于这两种形式都可以创建对象，所以我们首选更简单的文字
// 形式。建议只在需要那些额外选项时使用构造形式。
// Error 对象很少在代码中显式创建，一般是在抛出异常时被自动创建。也可以使用 new
// Error(..) 这种构造形式来创建，不过一般来说用不着。
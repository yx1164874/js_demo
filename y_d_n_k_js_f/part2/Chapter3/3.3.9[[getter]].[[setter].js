// 3.3.9 Getter和Setter
// 对象默认的[[Put]] 和[[Get]] 操作分别可以控制属性值的设置和获取。
// 在语言的未来 / 高级特性中，有可能可以改写整个对象（不仅仅是某个属性）
// 的默认[[Get]] 和[[Put]] 操作。这已经超出了本书的讨论范围，但是将来
// “你不知道的 JavaScript”系列丛书中有可能会对这个问题进行探讨。
// 在 ES5 中可以使用 getter 和 setter 部分改写默认操作，但是只能应用在单个属性上，无法
// 应用在整个对象上。 getter 是一个隐藏函数，会在获取属性值时调用。 setter 也是一个隐藏
// 函数，会在设置属性值时调用。
// 当你给一个属性定义 getter、 setter 或者两者都有时，这个属性会被定义为“访问描述
// 符”（和“数据描述符”相对）。对于访问描述符来说， JavaScript 会忽略它们的 value 和
// writable 特性，取而代之的是关心 set 和 get（还有 configurable 和 enumerable）特性。
// 思考下面的代码：

var myObject = {
    // 给 a 定义一个 getter
    get a() {
        return 2;
    }
};
Object.defineProperty(
    myObject, // 目标对象
    "b", // 属性名
    { // 描述符
        // 给 b 设置一个 getter
        get: function () { return this.a * 2 },
        // 确保 b 会出现在对象的属性列表中
        enumerable: true
    }
);
myObject.a; // 2
myObject.b; // 4
// 不管是对象文字语法中的 get a() { ..} ，还是 defineProperty(..) 中的显式定义，二者
// 都会在对象中创建一个不包含值的属性，对于这个属性的访问会自动调用一个隐藏函数，
// 它的返回值会被当作属性访问的返回值：
var myObject = {
    // 给 a 定义一个 getter
    get a() {
        return 2;
    }
};
myObject.a = 3;
myObject.a; // 2
// 由于我们只定义了 a 的 getter，所以对 a 的值进行设置时 set 操作会忽略赋值操作，不会抛
// 出错误。而且即便有合法的 setter，由于我们自定义的 getter 只会返回 2，所以 set 操作是
// 没有意义的。
// 为了让属性更合理，还应当定义 setter，和你期望的一样， setter 会覆盖单个属性默认的
// [[Put]]（也被称为赋值）操作。通常来说 getter 和 setter 是成对出现的（只定义一个的话
// 通常会产生意料之外的行为）：
var myObject = {
    // 给 a 定义一个 getter
    get a() {
        return this._a_;
    },
    // 给 a 定义一个 setter
    set a(val) {
        this._a_ = val * 2;
    }
};
myObject.a = 2;
myObject.a; // 4

// 在本例中，实际上我们把赋值（[[Put]]）操作中的值 2 存储到了另一个变量
// _a_ 中。名称 _a_ 只是一种惯例，没有任何特殊的行为——和其他普通属性
// 一样。


// 6.2　类与对象
// 我们已经看到了“类”和“行为委托”在理论和思维模型方面的区别，现在看看在真实场
// 景中如何应用这些方法。
// 首先看看 Web 开发中非常典型的一种前端场景：创建 UI 控件（按钮、下拉列表，等等）。

// 6.2.1　控件“类”
// 你可能已经习惯了面向对象设计模式，所以很快会想到一个包含所有通用控件行为的父类
// （可能叫作 Widget）和继承父类的特殊控件子类（比如 Button）。
// 这里将使用 jQuery 来操作 DOM 和 CSS，因为这些操作和我们现在讨论的
// 内容没有关系。这些代码并不关注你是否使用，或使用哪种 JavaScript 框架
// （ jQuery、 Dojo、 YUI，等等）来解决问题。
// 下面这段代码展示的是如何在不使用任何“类”辅助库或者语法的情况下，使用纯
// JavaScript 实现类风格的代码：

// 父类
function Widget(width, height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
}

Widget.prototype.render = function ($where) {
    if (this.$elem) {
        this.$elem.css({
            width: this.width + "px",
            height: this.height + "px"
        }).appendTo($where);
    }
};
// 子类
function Button(width, height, label) {
    // 调用“ super”构造函数
    Widget.call(this, width, height);
    this.label = label || "Default";
    this.$elem = $("<button>").text(this.label);
}
// 让 Button“继承” Widget
Button.prototype = Object.create(Widget.prototype);
// 重写 render(..)
Button.prototype.render = function ($where) {
    //“ super”调用
    Widget.prototype.render.call(this, $where);
    this.$elem.click(this.onClick.bind(this));
};
Button.prototype.onClick = function (evt) {
    console.log("Button '" + this.label + "' clicked!");

};

$(document).ready(function () {
    var $body = $(document.body);
    var btn1 = new Button(125, 30, "Hello");
    var btn2 = new Button(150, 40, "World");
    btn1.render($body);
    btn2.render($body);
});

// 在面向对象设计模式中我们需要先在父类中定义基础的 render(..) ，然后在子类中重写
// 它。子类并不会替换基础的 render(..) ，只是添加一些按钮特有的行为。
// 可以看到代码中出现了丑陋的显式伪多态（参见第 4 章），即通过 Widget.call 和 Widget.
//     prototype.render.call 从“子类”方法中引用“父类”中的基础方法。呸！

// ES6的class语法糖
// 附录 A 会详细介绍 ES6 的 class 语法糖，不过这里可以简单介绍一下如何使用 class 来实
// 现相同的功能：

class Widget {
    constructor(width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    }
    render($where) {
        if (this.$elem) {
            this.$elem.css({
                width: this.width + "px",
                height: this.height + "px"
            }).appendTo($where);
        }
    }
}
class Button extends Widget {
    constructor(width, height, label) {
        super(width, height);
        this.label = label || "Default";
        this.$elem = $("<button>").text(this.label);
    }
    render($where) {
        super($where);
        this.$elem.click(this.onClick.bind(this));
    }
    onClick(evt) {
        console.log("Button '" + this.label + "' clicked!");
    }
}

$(document).ready(function () {
    var $body = $(document.body);
    var btn1 = new Button(125, 30, "Hello");
    var btn2 = new Button(150, 40, "World");
    btn1.render($body);
    btn2.render($body);
});

// 毫无疑问，使用 ES6 的 class 之后，上一段代码中许多丑陋的语法都不见了， super(..)
// 函数棒极了。（尽管深入探究就会发现并不是那么完美！）
// 尽管语法上得到了改进，但实际上这里并没有真正的类， class 仍然是通过 [[Prototype]]
// 机制实现的，因此我们仍然面临第 4 章至第 6 章提到的思维模式不匹配问题。附录 A 会详
// 细介绍 ES6 的 class 语法及其实现细节，我们会看到为什么解决语法上的问题无法真正解
// 除对于 JavaScript 中类的误解，尽管它看起来非常像一种解决办法！
// 无论你使用的是传统的原型语法还是 ES6 中的新语法糖，你仍然需要用“类”的概念来对
// 问题（ UI 控件）进行建模。就像前几章试图证明的一样，这种做法会为你带来新的麻烦。

// 6.2.2　委托控件对象
// 下面的例子使用对象关联风格委托来更简单地实现 Widget / Button：
var Widget = {
    init: function (width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    },
    insert: function ($where) {
        if (this.$elem) {
            this.$elem.css({
                width: this.width + "px",
                height: this.height + "px"
            }).appendTo($where);
        }
    }
};
var Button = Object.create(Widget);
Button.setup = function (width, height, label) {
    // 委托调用
    this.init(width, height);
    this.label = label || "Default";
    this.$elem = $("<button>").text(this.label);
};
Button.build = function ($where) {

    // 委托调用
    this.insert($where);
    this.$elem.click(this.onClick.bind(this));
};
Button.onClick = function (evt) {
    console.log("Button '" + this.label + "' clicked!");
};
$(document).ready(function () {
    var $body = $(document.body);
    var btn1 = Object.create(Button);
    btn1.setup(125, 30, "Hello");
    var btn2 = Object.create(Button);
    btn2.setup(150, 40, "World");
    btn1.build($body);
    btn2.build($body);
});
// 使用对象关联风格来编写代码时不需要把 Widget 和 Button 当作父类和子类。相反，
// Widget 只是一个对象，包含一组通用的函数，任何类型的控件都可以委托， Button 同样只
// 是一个对。（ 当然，它会通过委托关联到 Widget ！）
// 从设计模式的角度来说，我们并没有像类一样在两个对象中都定义相同的方法名
// render(..) ，相反，我们定义了两个更具描述性的方法名（ insert(..) 和 build(..) ）。同
// 理， 初始化方法分别叫作 init(..) 和 setup(..) 。
// 在委托设计模式中，除了建议使用不相同并且更具描述性的方法名之外，还要通过对象关
// 联避免丑陋的显式伪多态调用（ Widget.call 和 Widget.prototype.render.call），代之以
// 简单的相对委托调用 this.init(..) 和 this.insert(..) 。
// 从语法角度来说，我们同样没有使用任何构造函数、 .prototype 或 new ，实际上也没必要
// 使用它们。
// 如果你仔细观察就会发现，之前的一次调用（ var btn1 = new Button(..) ）现在变成了
// 两次（ var btn1 = Object.create(Button) 和 btn1.setup(..) ）。乍一看这似乎是一个缺点
// （需要更多代码）。
// 但是这一点其实也是对象关联风格代码相比传统原型风格代码有优势的地方。为什么呢？
// 使用类构造函数的话，你需要（并不是硬性要求，但是强烈建议）在同一个步骤中实现构
// 造和初始化。然而，在许多情况下把这两步分开（就像对象关联代码一样）更灵活。
// 举例来说，假如你在程序启动时创建了一个实例池，然后一直等到实例被取出并使用时才
// 执行特定的初始化过程。这个过程中两个函数调用是挨着的，但是完全可以根据需要让它
// 们出现在不同的位置。
// 对象关联可以更好地支持关注分离（ separation of concerns）原则，创建和初始化并不需要
// 合并为一个步骤。
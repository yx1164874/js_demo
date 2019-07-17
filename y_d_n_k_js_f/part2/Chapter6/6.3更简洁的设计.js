// 6.3　更简洁的设计
// 对象关联除了能让代码看起来更简洁（并且更具扩展性）外还可以通过行为委托模式简化
// 代码结构。我们来看最后一个例子，它展示了对象关联如何简化整体设计。
// 在这个场景中我们有两个控制器对象，一个用来操作网页中的登录表单，另一个用来与服
// 务器进行验证（通信）。
// 我们需要一个辅助函数来创建 Ajax 通信。我们使用的是 jQuery（尽管其他框架也做
// 得不错），它不仅可以处理 Ajax 并且会返回一个类 Promise 的结果，因此我们可以使
// 用.then(..) 来监听响应。
// 这里我们不会介绍 Promise，但是在本系列之后的书中会介绍。
// 在传统的类设计模式中，我们会把基础的函数定义在名为 Controller 的类中，然后派生两
// 个子类 LoginController 和 AuthController，它们都继承自 Controller 并且重写了一些基
// 础行为：
// 父类
function Controller() {
    this.errors = [];
}
Controller.prototype.showDialog(title, msg){
    // 给用户显示标题和消息
};
Controller.prototype.success = function (msg) {
    this.showDialog("Success", msg);
};
Controller.prototype.failure = function (err) {
    this.errors.push(err);
    this.showDialog("Error", err);
};
// 子类
function LoginController() {
    Controller.call(this);
}
// 把子类关联到父类

LoginController.prototype =Object.create(Controller.prototype);
LoginController.prototype.getUser = function () {
    return document.getElementById("login_username").value;
};
LoginController.prototype.getPassword = function () {
    return document.getElementById("login_password").value;
};
LoginController.prototype.validateEntry = function (user, pw) {
    user = user || this.getUser();
    pw = pw || this.getPassword();
    if (!(user && pw)) {
        return this.failure(
            "Please enter a username & password!"
        );
    }
    else if (user.length < 5) {
        return this.failure(
            "Password must be 5+ characters!"
        );
    }
    // 如果执行到这里说明通过验证
    return true;
};
// 重写基础的 failure()
LoginController.prototype.failure = function (err) {
    //“ super”调用
    Controller.prototype.failure.call(
        this,
        "Login invalid: " + err
    );
};
// 子类
function AuthController(login) {
    Controller.call(this);
    // 合成
    this.login = login;
}
// 把子类关联到父类
AuthController.prototype =Object.create(Controller.prototype);
AuthController.prototype.server = function (url, data) {
    return $.ajax({
        url: url,
        data: data
    });
};
AuthController.prototype.checkAuth = function () {
    var user = this.login.getUser();
    var pw = this.login.getPassword();
    if (this.login.validateEntry(user, pw)) {

        this.server("/check-auth", {
            user: user,
            pw: pw
        })
            .then(this.success.bind(this))
            .fail(this.failure.bind(this));
    }
};
// 重写基础的 success()
AuthController.prototype.success = function () {
    //“ super”调用
    Controller.prototype.success.call(this, "Authenticated!");
};
// 重写基础的 failure()
AuthController.prototype.failure = function (err) {
    //“ super”调用
    Controller.prototype.failure.call(
        this,
        "Auth Failed: " + err
    );
};
var auth = new AuthController();
auth.checkAuth(
    // 除了继承，我们还需要合成
    new LoginController()
);

// 所 有 控 制 器 共 享 的 基 础 行 为 是 success(..) 、 failure(..) 和 showDialog(..) 。 子 类
// LoginController 和 AuthController 通过重写 failure(..) 和 success(..) 来扩展默认基础
// 类行为。此外，注意 AuthController 需要一个 LoginController 的实例来和登录表单进行
// 交互，因此这个实例变成了一个数据属性。
// 另一个需要注意的是我们在继承的基础上进行了一些合成。 AuthController 需要使用
// LoginController，因此我们实例化后者（ new LoginController() ）并用一个类成员属性
// this.login 来引用它，这样 AuthController 就可以调用 LoginController 的行为。
// 你可能想让 AuthController 继承 LoginController 或者相反，这样我们就通
// 过继承链实现了真正的合成。但是这就是类继承在问题领域建模时会产生
// 的问题，因为 AuthController 和 LoginController 都不具备对方的基础行为，
// 所以这种继承关系是不恰当的。我们的解决办法是进行一些简单的合成从而
// 让它们既不必互相继承又可以互相合作。
// 如果你熟悉面向类设计，你一定会觉得以上内容非常亲切和自然。



// 反类
// 但是，我们真的需要用一个 Controller 父类、两个子类加上合成来对这个问题进行建模
// 吗？能不能使用对象关联风格的行为委托来实现更简单的设计呢？当然可以！

var LoginController = {
    errors: [],
    getUser: function () {
        return document.getElementById(
            "login_username"
        ).value;
    },
    getPassword: function () {
        return document.getElementById(
            "login_password"
        ).value;
    },
    validateEntry: function (user, pw) {
        user = user || this.getUser();
        pw = pw || this.getPassword();
        if (!(user && pw)) {
            return this.failure(
                "Please enter a username & password!"
            );
        }
        else if (user.length < 5) {
            return this.failure(
                "Password must be 5+ characters!"
            );
        }
        // 如果执行到这里说明通过验证
        return true;
    },
    showDialog: function (title, msg) {
        // 给用户显示标题和消息
    },
    failure: function (err) {
        this.errors.push(err);
        this.showDialog("Error", "Login invalid: " + err);
    }
};
// 让 AuthController 委托 LoginController

var AuthController = Object.create(LoginController);
AuthController.errors = [];
AuthController.checkAuth = function () {
    var user = this.getUser();
    var pw = this.getPassword();
    if (this.validateEntry(user, pw)) {
        this.server("/check-auth", {
            user: user,
            pw: pw
        })
            .then(this.accepted.bind(this))
            .fail(this.rejected.bind(this));
    }
};
AuthController.server = function (url, data) {
    return $.ajax({
        url: url,
        data: data
    });
};
AuthController.accepted = function () {
    this.showDialog("Success", "Authenticated!")
};
AuthController.rejected = function (err) {
    this.failure("Auth Failed: " + err);
};

// 由于 AuthController 只是一个对象（ LoginController 也一样），因此我们不需要实例化
// （比如 new AuthController() ），只需要一行代码就行：
// AuthController.checkAuth();
// 借助对象关联，你可以简单地向委托链上添加一个或多个对象，而且同样不需要实例化：
var controller1 = Object.create(AuthController);
var controller2 = Object.create(AuthController);

// 在行为委托模式中， AuthController 和 LoginController 只是对象，它们之间是兄弟关系，
// 并不是父类和子类的关系。代码中 AuthController 委托了 LoginController，反向委托也
// 完全没问题。
// 这种模式的重点在于只需要两个实体（ LoginController 和 AuthController），而之前的模
// 式需要三个。
// 我们不需要 Controller 基类来“共享”两个实体之间的行为，因为委托足以满足我们需要
// 的功能。同样，前面提到过，我们也不需要实例化类，因为它们根本就不是类，它们只是
// 对象。此外，我们也不需要合成，因为两个对象可以通过委托进行合作。
// 最后，我们避免了面向类设计模式中的多态。我们在不同的对象中没有使用相同的函
// 数名 success(..) 和 failure(..) ，这样就不需要使用丑陋的显示伪多态。相反，在
// AuthController 中它们的名字是 accepted(..) 和 rejected(..) ——可以更好地描述它们的
// 行为。
// 总结：我们用一种（极其）简单的设计实现了同样的功能，这就是对象关联风格代码和行
// 为委托设计模式的力量。
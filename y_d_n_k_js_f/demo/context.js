function foo(e) {
    console.log(e, this.id);
}

var obj = {
    id: "awesome"
};

// 调用 foo(..) 时把 this 绑定到 obj
[1, 2, 3].forEach(foo, obj);

// 1 awesome 2 awesome 3 awesome
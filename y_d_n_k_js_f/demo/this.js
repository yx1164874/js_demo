var str = 'wolrd';
var obj = {
    a: "hello"
}
var a='xxxx';
// var obj1 = {
//     a: "xxx"
// }

// function foo(){
//     return (a)=>{
//         //this继承foo的作用域,this绑定foo的作用域,箭头函数的绑定无法被修改
//         console.log(this.a);
//     }
// }

// var bar=foo.call(obj);
// bar.call(obj1)
function foo() {
    var self=this
    setTimeout(function() {
        console.log(self.a)
    }, 500)
}
foo.call(obj)
// var bar = foo.call(obj);
// bar.call(obj1)

// 箭头函数可以像 bind(..) 一样确保函数的 this 被绑定到指定对象，此外，其重要性还体
// 现在它用更常见的词法作用域取代了传统的 this 机制。实际上，在 ES6 之前我们就已经
// 在使用一种几乎和箭头函数完全一样的模式。


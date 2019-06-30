//new 
// 1.创建一个新对象
// 2.这个对象会被执行[[原型链接]]
// 3.这个新对象会绑定到函数调用的this上
// 4.如果函数没有返回其他对象，那么new表达式的函数调用会自动返回这个新对象

function Foo(a){
   this.a=a
}

var f=new Foo('hello')
console.log(f.a)
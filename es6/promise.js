//1.Promise 的含义

/* 
Promise 是异步编程的一种解决方案，
比传统的解决方案——回调函数和事件——更合理和更强大。
它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，
原生提供了Promise对象。
*/

/*
所谓Promise，简单说就是一个容器，
里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。
从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。
Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。
*/

/*
（1）对象的状态不受外界影响。Promise对象代表一个异步操作，
有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。
只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。
Promise对象的状态改变，只有两种可能：
从pending变为fulfilled和从pending变为rejected。
只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。

如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。
这与事件（Event）完全不同，
事件的特点是，如果你错过了它，再去监听，是得不到结果的。

注意，为了行文方便，本章后面的resolved统一只指fulfilled状态，不包含rejected状态。
*/

//2.基本用法

//ES6 规定，Promise对象是一个构造函数，用来生成Promise实例。




/*
有了Promise对象，
就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。
此外，Promise对象提供统一的接口，使得控制异步操作更加容易。

Promise也有一些缺点。
首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。
其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

如果某些事件不断地反复发生，一般来说，使用 Stream 模式是比部署Promise更好的选择。
*/
// const flag = true
// const promise = new Promise(function (resolve, reject) {

//     if (flag) {
//         resolve("value");
//     } else {
//         reject("err")
//     }
// })
// promise.then(function (value) { 
//     // console.log("success",value)
// }, function (err) { 
//     // console.log("err",err)
// })

// function timout(ms){
//     return new Promise((resolve,reject)=>{
//         setTimeout(resolve,ms,"done");
//     })
// }

// timout(1000).then((success)=>{
//     // console.log("success",success)
// })

// //Promise 新建后就会立即执行。

// const _promise=new Promise((resolve,reject)=>{
//     // console.log("_promise");
//     resolve("hello wolrd");
// })


// _promise.then((success)=>{
//     // console.log("then",success)
// })

// // console.log("同步代码")


// /*
// 上面代码中，Promise 新建后立即执行，所以首先输出的是Promise。
// 然后，then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，
// 所以resolved最后输出。
// */

// const p=new Promise((resolve,reject)=>{
//     // console.log("fff")
//     return resolve("ppppp")
//     console.log("jjjjjjj")
// }).then((succ)=>{
//     // console.log("succ",succ)
// })

// const p1=new Promise((resolve,reject)=>{
//     resolve("执行p1成功!");
// }).then((succ)=>{
//     // console.log("succ",succ)
// })

// const p2=new Promise((resolve,reject)=>{
//     resolve(p1)
// }).then((succ)=>{
//     // console.log("执行完p1,再执行p2",succ)
// })

/*
上面代码中，p1和p2都是 Promise 的实例，
但是p2的resolve方法将p1作为参数，即一个异步操作的结果是返回另一个异步操作。

注意，这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态。
如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变；
如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执行。

*/

// new Promise((resolve, reject) => {
//   resolve(1);
//   console.log(2);
// }).then(r => {
//   console.log(r);
// });
// 2
// 1

/*
上面代码中，调用resolve(1)以后，后面的console.log(2)还是会执行，并且会首先打印出来。
这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

一般来说，调用resolve或reject以后，Promise 的使命就完成了，后继操作应该放到then方法里面，
而不应该直接写在resolve或reject的后面。所以，最好在它们前面加上return语句，这样就不会有意外。
*/


// 3.Promise.prototype.then()




// const promise = new Promise(function (resolve, reject) {

//     reject("error");
// }).then(function (resolve) {
//     console.log(resolve)
// }).catch(function (error) {
//     console.log("error", error);
// });

/*
Promise 实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的。
它的作用是为 Promise 实例添加状态改变时的回调函数。
前面说过，then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。

then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。
因此可以采用链式写法，即then方法后面再调用另一个then方法。
*/

// getJSON('/post/1.json').then(function (post) {
//     return getJSON(post.commentURL);
// }).then(function (comments) {
//     // some code
// }).catch(function (error) {
//     // 处理前面三个Promise产生的错误
// });

/*
上面代码中，第一个then方法指定的回调函数，返回的是另一个Promise对象。
这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。
如果变为resolved，就调用第一个回调函数，
如果状态变为rejected，就调用第二个回调函数。
*/ 

//4.Promise.prototype.catch()

// getJSON('/posts.json').then(function(posts) {
//   // ...
// }).catch(function(error) {
//   // 处理 getJSON 和 前一个回调函数运行时发生的错误
//   console.log('发生错误！', error);
// });

/*
上面代码中，getJSON方法返回一个 Promise 对象，如果该对象状态变为resolved，
则会调用then方法指定的回调函数；
如果异步操作抛出错误，状态就会变为rejected，就会调用catch方法指定的回调函数，处理这个错误。
另外，then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获。

*/

/*
上面代码中，一共有三个 Promise 对象：
一个由getJSON产生，两个由then产生。
它们之中任何一个抛出的错误，都会被最后一个catch捕获。
*/

/*
一般来说，不要在then方法里面定义 
Reject 状态的回调函数（即then的第二个参数），
总是使用catch方法。
*/

// const someAsyncThing = function () {
//   return new Promise(function (resolve, reject) {
//     // 下面一行会报错，因为x没有声明
//     resolve(x + 2);
//   });
// };

// someAsyncThing().then(function () {
//   console.log('everything is great');
// });

// setTimeout(() => { console.log(22222) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123

/*
上面代码中，someAsyncThing函数产生的 Promise 对象，内部有语法错误。
浏览器运行到这一行，会打印出错误提示ReferenceError: x is not defined，
但是不会退出进程、终止脚本执行，
2 秒之后还是会输出123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，
通俗的说法就是“Promise 会吃掉错误”。
 
*/

// const promise = new Promise(function (resolve, reject) {
//   resolve('ok');
//   setTimeout(function () { throw new Error('test') }, 0)
// });
// promise.then(function (value) { console.log(value) });
// ok
// Uncaught Error: test

/*
上面代码中，Promise 指定在下一轮“事件循环”再抛出错误。
到了那个时候，Promise 的运行已经结束了，
所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。

一般总是建议，Promise 对象后面要跟catch方法，
这样可以处理 Promise 内部发生的错误。
catch方法返回的还是一个 Promise 对象，因此后面还可以接着调用then方法。
*/


//5.Promise.prototype.finally() 

/*
finally方法用于指定不管 Promise 对象最后状态如何，
都会执行的操作。该方法是 ES2018 引入标准的。
*/

const promise=new Promise((resolve,reject)=>{
  resolve("ssssss")

}).then((succ)=>{
  console.log("succ",succ)
}).catch(()=>{
  console.log("catch")
}).finally(()=>{
  console.log("finally")
})
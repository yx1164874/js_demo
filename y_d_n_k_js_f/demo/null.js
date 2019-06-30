function foo(a,b) {
    console.log('a: '+a+' b: '+b);
}
var a = 2;
foo.apply(null,[2,3]); // 2

//使用bind 进行柯里化(预先设置一些参数)
var bar=foo.bind(null,7)

bar(7);


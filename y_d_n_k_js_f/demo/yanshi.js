function foo(something){
    return this.a+something
}

var obj={
    a:2
}
var bar=function(){
    return foo.apply(obj,arguments)
}

var b=bar(3);
console.log(b)


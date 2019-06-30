//显示绑定obj

 var obj={
     a:2
 }

 function foo(something){
     return  this.a+something
 }
 function bind(foo,obj){
     return function(){
         return  foo.apply(obj,arguments)
     }
 }
 
 var bar=bind(foo,obj)
 var b=bar(3)

 console.log(b)
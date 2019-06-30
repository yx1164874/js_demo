var obj={
    a:"hello world",
    say:function(){
        console.log(this.a)
    }

}

function show(fn){
    fn();
}
var a='the world'


//隐式绑定丢失this，变为默认绑定绑定到全局变量
show(obj.say);
var bar=obj.say;

setTimeout(obj.say,1000)




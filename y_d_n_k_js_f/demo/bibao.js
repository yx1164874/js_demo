function bibao(){
    var a='hello';
    function hello(){
        console.log(a)
    }
    function say(){
        console.log('hello world');
    }
    return {
        hello:hello(),
        say:say()
    }
}

var bar=bibao();

bar.hello;

bar.say;
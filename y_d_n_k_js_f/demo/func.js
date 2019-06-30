function add(a,b){
    return function(){
        return a+b
    }
}
var bar =add(3,2); 
var b=bar()
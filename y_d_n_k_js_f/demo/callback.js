function hello(){
    console.log('hello wolrd');
}

function show(param,callback){

    console.log(param);
    if(typeof callback=='function'){
        callback()
    }
}
show('hi',hello);

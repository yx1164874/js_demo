var count=10;

function countDown(){
    if(count>0){
        count--;
        console.log(count);
    }else{
        clearInterval(setinter);
        console.log('到头了')
    }
    
    
}
var setinter=setInterval(countDown,1000);
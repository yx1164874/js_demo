var maxtime =  10;

function CountDown() {
    if (maxtime >= 0) {
        minutes = Math.floor(maxtime / 60)
        seconds = Math.floor(maxtime % 60) 
        // msg = "距离结束还有" + minutes + "分" + seconds + "秒";
        maxtime--;
        console.log(minutes + ' : ' + seconds);
        if (maxtime == 5 * 60) alert("还剩5分钟");
    } else {
        clearInterval(setinterval);
        console.log('答题结束')
    }
}

var setinterval = setInterval(CountDown, 1000);
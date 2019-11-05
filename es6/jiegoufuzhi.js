// 1）交换变量的值

let x = 1;
let y = 2;

[x, y] = [y, x];
// 上面代码交换变量x和y的值，这样的写法不仅简洁，而且易读，语义非常清晰。

// （2）从函数返回多个值

// 函数只能返回一个值，如果要返回多个值，只能将它们放在数组或对象里返回。有了解构赋值，取出这些值就非常方便。

// 返回一个数组

function example() {
    return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
    return {
        foo: 1,
        bar: 2
    };
}
let { foo, bar } = example();
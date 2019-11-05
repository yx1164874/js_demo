import { Promise } from "core-js";
var data = [0, 1, 2, 3, 4];
data.map(item => item + 1);
const promise = new Promise((resolve, reject) => {
    resolve("hello wolrd");
}).then(succ => {
    console.log("succ", succ);
}).catch(err => {
    console.log("err", err);
});
const map = new Map();

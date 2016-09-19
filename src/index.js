/**
 * Created by xudawei on 16/9/18.
 */

//webpack  入口文件
var str = require('./component');  //node 原生写法  commonjs  写法
require('./scss/index');  //把scss模块引入到当前项目中
//console.log(str,'211111');
require('bootstrap/dist/css/bootstrap.css');

var oImg = document.createElement('img');
oImg.className = 'cat';
oImg.src = require('./images/cat.jpg');
document.body.appendChild(oImg);
var $ = require('jquery');
$('#app').html(str);



//es6方法
var write = s => {
   // document.write(s);
}
write(str);
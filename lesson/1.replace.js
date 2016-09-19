/**
 * Created by xudawei on 16/9/18.
 */

//这是跟后台约定好的接口
var originUrl ='/api/books/add';
//目标服务器 只能接受  /books.json

function replace(src) {
    return src.replace(/\/api\/(.+)\/(.+)/,'\/$1\.$2\.json')
}
console.log(replace(originUrl))


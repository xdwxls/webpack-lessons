/**
 * Created by xudawei on 16/9/18.
 */

//目录文件   输出的文件

    //导出一个对象
var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');

//css文件单独加载
var  extractTextWebpackPlugin = require('extract-text-webpack-plugin');

//得到jquery 的绝对路径
var jqueryPath = path.resolve('node_modules/jquery/dist/jquery.js');

//进行路径的转换,传入要替换什么样的路径
function rewriteUrl(replacePath) {//重写url
    return function (req, opt) {
        var queryIndex = req.url.indexOf('?');//取得?所在的索引
        var query = queryIndex >= 0 ? req.url.substr(queryIndex) : "";//取得查询字符串的内容
        //把proxy的path替换为 '/$1\.json',$1取自path匹配到的真实路径中的第一个分组
        req.url = req.path.replace(opt.path, replacePath) + query;
    };
}

module.exports = {
    //设置入口文件的绝对路径
    //entry:path.resolve('src/index.js'),
    entry:{
        index:path.resolve('src/index.js'),
        vendor:['jquery']
    },
    //设置输出
    output:{
        path:'./build',  //设置输出目录
        //filename:'bundle.js' //设置输出保存的文件名
        filename:'[name].[hash].js' //设置输出保存的文件名
    },
    //如何解析文件
    resolve:{
        //指定文件扩展名
        extensions:['','.js','.css','.json','.scss'],
        //指定模块的别名 指定后不需要再走原有的node模块流程,直接定位到文件
        alias:jqueryPath
    },
    //指定webpack-dev-server 的配置项
    devServer:{
        inline:true, //在源代码修改后重新打包,刷新浏览器
        stats: { colors: true }, //显示颜色
        port:8080,//配置端口号
        contentBase:'./build',//配置文件根目录
       /* proxy:[
            {
                //用来匹配请求url的正则
                path: /^\/api\/(.*)/,
                //将此请求转发给哪个服务器
                target:'http://localhost:8080/',
                //转换路径,把原路径转成目标路径
                rewrite:rewriteUrl('/$1\.json'),
                //修改来源的路径
                changeOrigin:true

            }
        ]*/
    },
    //配置模块
    module:{
        loaders:[ //指定不同文件的加载器
            {
                test:/\.js$/,//指定要加载的文件
                loader:'babel-loader'//指定加载器
            },
            {
                test:/\.scss$/,//如果是scss文件,如何加载
              //  include: path.resolve('./src/css'),
               // loader:'style!css!sass'//指定加载器
                loader: extractTextWebpackPlugin.extract("style-loader", "css-loader!sass-loader")
                
            },
            {
                test:/\.css$/,//如果是css文件,如何加载
                //loader:'style!css'
                loader: extractTextWebpackPlugin.extract("style-loader", "css-loader")
            },
            {
                test:/\.(eot|svg|ttf|woff|woff2)$/,
                loader:'url?limit=8192'
            },
            {
                test:/\.(png|jpg|gif)$/,
                loader:'url?limit=8192'
            },
            {
                test: /jquery.js$/,
                loader: "expose?jQuery"
            }
        ]
    },
    devtool: 'eval-source-map',
    plugins:[
        new extractTextWebpackPlugin("bundle.[hash].css"),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        //把template里的文件拷贝到目标目录并且自动插入产出的或者打包后的文件
        new htmlWebpackPlugin({
            title:'珠峰webpack',
            template:'./src/index.html',
            filename:'index.html'
        }),
        new openBrowserWebpackPlugin({
            url:'http://localhost:8080'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.MinChunkSizePlugin({
            compress: {
                warnings: false
            }
        }),
        // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
        new webpack.optimize.DedupePlugin(),
        // 按引用频度来排序 ID，以便达到减少文件大小的效果
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
        })


    ]
};

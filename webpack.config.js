const webpack = require('webpack');
const commonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'); //提取多个入口文件的公共脚本部分
const path = require('path'); //node路径工具
const htmlWebpackPlugin = require('html-webpack-plugin'); //自动化生成html
const srcDir = path.resolve(process.cwd(), 'src'); //返回运行当前脚本的工作目录的路径
const TransferWebpackPlugin = require('transfer-webpack-plugin'); //copy目录下的文件到输出目录

module.exports = {
  //开启缓存
  // cache:true,
  //开启监听
  // watch:true,
  //插件项
  plugins: [
    new commonsChunkPlugin('js/common.min.js')
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     }
    // }),
    // new TransferWebpackPlugin([
    //     {from: 'js/lib',to:'js/lib'}
    // ], path.resolve(__dirname,"src")),
    // new TransferWebpackPlugin([
    //     {from: 'images',to:'images'}
    // ], path.resolve(__dirname,"src")),
    // new htmlWebpackPlugin({
    //     filename:'index.html',        //生成文件名
    //     template:'src/index.html',    //模版
    //     inject:'body',     //js插入位置
    //     minify:{          //压缩html
    //         removeComments:true,
    //         collapseWhitespace:true
    //     }
    // })
  ],
  //页面入口文件配置
  entry: {
    main: path.resolve(__dirname, 'src/js/main.js') //__dirname获取当前模块文件所在目录的完整绝对路径
  },
  //入口文件输出配置
  output: {
    path: path.join(__dirname, 'public'), //合并路径
    // publicPath: 'public/js/',
    filename: 'js/[name].js?[hash:6]',
    //版本化数据块
    chunkFilename: 'js/[name].js?[hash:6]'
  },
  module: {
    //加载器配置
    loaders: [
      //加载vue文件
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      //es6代码转换成es5代码
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: path.resolve(__dirname, 'node_modules'),
        query: {
          presets: ['es2015']
        }
      },
      //处理css
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      //处理图片
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'url-loader?limit=5000&name=images/[name].[ext]', //设置小于5000的图片用base64引入
          'image-webpack' //压缩img
        ]
      }
    ]
  },
  //其它解决方案配置
  resolve: {
    //查找module的话从这里开始查找
    root: path.join(__dirname, 'node_modules'), //绝对路径
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.json', '.scss', '.vue', '.css'],
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      base: srcDir + '/js/base',
      lib: srcDir + '/js/lib',
      app: srcDir + '/js/app',
      components: srcDir + '/components'
    }
  }
};

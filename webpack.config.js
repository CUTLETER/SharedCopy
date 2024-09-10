let path = require('path');
const webpack = require('webpack');


module.exports = {
    context: path.resolve(__dirname, 'src/main/react'),
    entry: {

        login: './login/Login.js', // 로그인
        employee: './employee/employee.js', // 직원
        order: './order/Order.js', //주문
        buyer: './buyer/Buyer.js',// 고객
        product: './product/Product.js', // 상품
        confirm: './confirm/Confirm.js', // 결재
        price: './price/price.js', // 판매가
        myPage: './myPage/myPage.js', // 판매가
        main: './main/Main.js',
    },
    devtool: 'sourcemaps',
    cache: true,
    output: { //파일이 생성되는 경로
        path: __dirname,
        filename: './src/main/resources/static/bundle/[name].bundle.js'
    },
    mode: 'none',
    module: {
        rules: [ {
            test: /\.js?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [ '@babel/preset-env', '@babel/preset-react' ]
                }
            }
        }, {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        },
            {
            test: /\.m?js/,
            resolve: {
                fullySpecified: false
            }
        }
            ]
    },

    plugins: [
        // fix "process is not defined" error:
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
};
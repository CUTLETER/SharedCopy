let path = require('path');
const webpack = require('webpack');

// 현재 시간을 가져오는 함수
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString();
}

module.exports = {
    context: path.resolve(__dirname, 'src/main/react'),
    entry: {

        login: './login/Login.js', // 로그인
        employee: './employee/Employee.js', // 직원
        order: './order/Order.js', //주문
        customer: './customer/Customer.js',// 고객
        product: './product/Product.js', // 직원
        price: './price/price.js', // 판매가
        myPage: './myPage/myPage.js', // 마이페이지
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
                    presets: [ '@babel/preset-env', ["@babel/preset-react", {"runtime": "automatic"}] ]
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
        new webpack.DefinePlugin({
            BUILD_TIME: JSON.stringify(getCurrentTime()), // 현재 시간을 BUILD_TIME으로 정의
        }),
        {
            apply: (compiler) => {
                compiler.hooks.beforeCompile.tap('ShowTimePlugin', () => {
                    console.log('Webpack Build Time:', getCurrentTime());
                });
            },
        },
    ],
};
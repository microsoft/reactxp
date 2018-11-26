import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpackDevServer from 'webpack-dev-server';
import * as webpack from 'webpack';
import * as path from 'path';

const APP_PATH = path.join(__dirname, 'src');
const TEMPLATE_PATH = path.join(__dirname, 'web', 'template.html');

const config: webpack.Configuration = {
    entry: APP_PATH,

    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/dist'),
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'tslint-loader',
                enforce: 'pre',
            },

            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({ inject: true, template: TEMPLATE_PATH }),
    ],

    devServer: {
        contentBase: APP_PATH,
        openPage: '',
        inline: true,
        stats: 'minimal',
        open: true,
        port: 9999
    },
};

export default config;

import * as webpack from 'webpack';

const config: webpack.Configuration = {
    entry: "./src/index.tsx",
    mode: "development",
    output: {
        filename: "dist/bundle.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "tslint-loader"
            }
        ]
    }
};

export default config;

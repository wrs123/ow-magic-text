module.exports = {
    style: {
        sass: {
            loaderOptions: {
                implementation: require('sass'),
                sassOptions: {
                    // 使用新版 API 的配置
                    fiber: require('fibers'),
                    indentedSyntax: false // 设置为 true 如果你使用 .sass 语法
                },
            },
        },
    },
    webpack: {
        configure: (webpackConfig) => {
            // 修改配置示例：设置 publicPath
            webpackConfig.output.publicPath = './';

            return webpackConfig;
        }
    },
    devServer: {
        // 开发环境也处理 PUBLIC_URL
        devMiddleware: {
            publicPath: './'
        }
    }
};

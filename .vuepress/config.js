var path = require('path')

module.exports = {
    title: '真牛英雄',
    description: '看啥看',
    themeConfig: {
        nav: [{
                text: '首页',
                link: '/'
            },
            {
                text: '代码',
                link: '/blogs/coding/'
            },
            {
                text: '健身',
                link: '/blogs/bodybuilding/'
            }, {
                text: '游戏',
                link: '/blogs/gameing/'
            },
        ],
        sidebar: {
            '/blog/': [
                ''
            ],
            '/blogs/coding/': [{
                    title: '基础芝士',
                    collapsable: true,
                    children: [
                        '/blogs/coding/base/',
                        '/blogs/coding/base/markdown',
                        '/blogs/coding/base/ssh',
                        '/blogs/coding/base/vim',
                    ]
                },
                {
                    title: '前端学习',
                    collapsable: true,
                    children: [
                        '/blogs/coding/frontend/'
                    ]
                }, {
                    title: 'JavaScript学习',
                    collapsable: true,
                    children: [
                        '/blogs/coding/javascript/eventloop',
                        '/blogs/coding/javascript/excute-context',
                        '/blogs/coding/javascript/promise-a-plus',
                        '/blogs/coding/javascript/promise',
                        '/blogs/coding/javascript/es6-array',
                        '/blogs/coding/javascript/es6-module'
                    ]
                },
                {
                    title: 'CSS学习',
                    collapsable: true,
                    children: [
                        '/blogs/coding/css/'
                    ]
                },
                {
                    title: 'Vue源码学习',
                    collapsable: true,
                    children: [
                        '/blogs/coding/vue/vue-source-init',
                        '/blogs/coding/vue/vue-source-data'
                    ]
                },
                {
                    title: 'React学习',
                    collapsable: true,
                    children: [
                        '/blogs/coding/react/react-tutorial'
                        // '/blogs/coding/react/react-readme'
                    ]
                },
                {
                    title: 'docker学习',
                    collapsable: true,
                    children: [
                        '/blogs/coding/docker/'
                    ]
                },
                {
                    title: 'Java学习',
                    collapsable: true,
                    children: [
                        '/blogs/coding/java/'
                    ]
                },
                {
                    title: 'Spring学习',
                    collapsable: true,
                    children: [
                        '/blogs/coding/spring/'
                    ]
                }
            ],
            '/blogs/bodybuilding/': [
                '', 'tmf', 'test2'
            ]
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@img': path.join(__dirname, '../static')
            }
        }
    }
}

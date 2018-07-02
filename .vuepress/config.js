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
                link: '/blogs/coding/other/linux'
            },
            {
                text: '健身',
                link: '/blogs/bodybuilding/tmf'
            }, {
                text: '游戏',
                link: '/blogs/gameing/'
            },
        ],
        sidebar: {
            '/blogs/coding/': [{
                    title: '其他',
                    collapsable: true,
                    children: [
                        '/blogs/coding/other/linux',
                        '/blogs/coding/other/markdown',
                        '/blogs/coding/other/ssh',
                        '/blogs/coding/other/vim'
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
                '/blogs/bodybuilding/tmf',
                '/blogs/bodybuilding/training-plan'
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

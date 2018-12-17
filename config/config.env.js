/**
 *  dev-env配置
 *  Created by shiyanlin
 *  810975746@qq.com
 *  test.gateway
 */

module.exports = {
    "dev": {
        "LINK_URL": "//dev.api.com", // 开发环境api Url
        "DEBUG": true,
        "NODE_ENV": "dev",
    },
    "test": {
        "LINK_URL": "//test.api.com", // 测试环境api Url
        "DEBUG": true,
        "NODE_ENV": "test",
    },
    "production": {
        "LINK_URL": "//product.api.com", // 开发环境api Url
        "DEBUG": false,
        "NODE_ENV": "production",
    }
}

/**
 *  dev-env配置
 *  Created by shiyanlin
 *  810975746@qq.com
 *  test.gateway
 */

module.exports = {
    "dev": {
        "LINK_URL": "开发环境",
        "DEBUG": true,
        "NODE_ENV": "dev",
    },
    "test": {
        "LINK_URL": "测试",
        "DEBUG": true,
        "NODE_ENV": "test",
    },
    "production": {
        "LINK_URL": "生产",
        "DEBUG": false,
        "NODE_ENV": "production",
    }
}

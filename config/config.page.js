/**
 * 多入口页面配置
 * @author barret
 * @data 2018/04/06
 */

module.exports = [
    {
        "name": "todoIndex",
        "entry": "./app/todo/index.js",
        "title": "todoList",
        "filename": "index.html",
        "template": "template.ejs",
        "chunks": "todoIndex",
    }
]
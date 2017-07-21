#!/usr/bin/env node

var current_path = process.cwd();
// runkoa 用于加载 bable 自动处理 koa2 中低版本node无法识别的语法, 如 async/await 等
require('runkoa')(current_path + '/bin/www.js' )

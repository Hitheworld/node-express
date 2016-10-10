var mongoose = require("mongoose");  //引入建模工具模块
var UserSchema = require("../schemas/user.schemas");
var User = mongoose.model("User",MovieSchema);  //编译生成模型

//将User构造函数导出
module.exports = User;
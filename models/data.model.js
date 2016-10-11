var mongoose = require("mongoose");  //引入建模工具模块
var DataSchema = require("../schemas/data.schemas.js");
var Data = mongoose.model("Data",DataSchema);  //编译生成模型

//将Movie构造函数导出
module.exports = Data;
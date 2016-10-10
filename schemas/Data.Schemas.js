var mongoose = require("mongoose");  //引入建模工具模块

var guidGenerate = require('../utils/GuidGenerate');

var DataSchema = new mongoose.Schema({
	img: String,
	url: String,
	title: String,
	id: {
		unique: true,
		type: String,
		meta: {
			createAt: {
				type: String,
				default: guidGenerate()
			}
		}
	},
	time: String,
		meta: {
			createAt: {
				type: Date,
				default: Date.now()
			},
			updateAt: {
				type: Date,
				default: Date.now()
			}
		}
});


/*方法,每次存入数据之前都会来调用此方法*/
DataSchema.pre("save",function(next){
	//判断数据是否是新加的
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	/*存储流程继续走下去*/
	next();
});

/** 只有经过模形的时候才交互 静态方法(编译、实例化后才有此方法) */
DataSchema.statics = {
	/*用于取出数据库中的数据*/
	fetch: function(cb){
		return this
			.find({})
			.sort("meta.updateAt") //排序.按更新时间排序
			.exec(cb)  //执行回调方法
	},
	//用来查询单条的数据
	findById: function(id,cb){
		return this
			.findOne({_id:id})
			.sort("meta.updateAt") //排序.按更新时间排序
			.exec(cb)  //执行回调方法
	}
}

//模式导出
module.exports = DataSchema;
/**
 * 数据接口API
 * @type {*|exports|module.exports}
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var xss = require('xss');
var _ = require("underscore");
//var bodyParser = require('body-parser');
//
//router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({ extended: true }));

var Data = require("../models/data.model");
var guidGenerate = require('../utils/guid.util');

/*后台管理-详情页-添加数据*/
router.get("/write/type",function(req,res){
	if(!req.session.user){
		return res.send({
			status: 0,
			info: '未鉴权认证'
		});
	}

	return res.send({
		status: 1,
		data:{
			img: "",
			url: "",
			title: "",
			id: "",
			time: ""
		}
	});
});


// admin post movie
router.post("/write/type/:type",function(req,res){
	if(!req.session.user){
		return res.send({
			status: 0,
			info: '未鉴权认证'
		});
	}
	var type = req.params.type;
	console.log("----------------------type++++:", type);
	// 判断是否是新加或者是更新的数据
	var id = req.body.data._id;
	console.log("----------------------_id++++:", id);
	var movieObj = req.body.data;
	console.log("----------------------write 22222222");
	if(!movieObj ){
        return res.send({
            status: 0,
            info: '提交的字段不全'
        });
    }

	var _movie;

	if(id !== "undefined"){
		console.log("----------------------99999");
        Data.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}

			//替换老的数据
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}

				//重定向到详情页面
				res.redirect("/write/type/"+type);
			});
		});
	} else {
		console.log("----------------------新增方法");
		// 新加的数据
		_movie = new Data({
			img: movieObj.img,
			url: movieObj.url,
			title: movieObj.title,
			id: movieObj.id,
			time: movieObj.time
		});

		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}

			//重定向到详情页面
			res.redirect("/write/type/"+type);
		});
	}
});

//读取数据模块
router.get("/read/type/:type",function(req,res){
	var type = req.params.type;
	Data.fetch(function(err,data){
		if(err){
			console.log(err)
		}

		//分页
		var COUNT = 50;
        //TODO: try
        var obj = [];
        try{
            obj = JSON.parse(data.toString());
        }catch(e){
            obj = [ ];
        }
        if(obj.length > COUNT){
            obj = obj.slice(0, COUNT);
        }
        return res.send({
            status: 1,
            data: obj
        });
	});
});

////读取数据模块
////data/read/it
//router.get('/read/type/:type', function(req, res, next) {
//    var type = req.params.type || '';
//    fs.readFile(PATH + type + '.json', function(err, data){
//        if(err){
//            return res.send({
//                status: 0,
//                info: '读取文件失败!'
//            });
//        }
//
//        var COUNT = 50;
//        //TODO: try
//        var obj = [];
//        try{
//            obj = JSON.parse(data.toString());
//        }catch(e){
//            obj = [ ];
//        }
//        if(obj.length > COUNT){
//            obj = obj.slice(0, COUNT);
//        }
//        return res.send({
//            status: 1,
//            data: obj
//        });
//    });
//});


////数据存储模块
//router.post('/write/type/:type', function(req, res, next){
//	if(!req.session.user){
//		return res.send({
//			status: 0,
//			info: '未鉴权认证'
//		});
//	}
//    //文件名
//    var type = req.params.type || '';
//    //关键字段
//    var url = req.param('url') || '';
//    var title = req.param('title') || '';
//    var img = req.param('img') || '';
//    if(!type || !url || !title || !img){
//        return res.send({
//            status: 0,
//            info: '提交的字段不全'
//        });
//    }
//    //(1)读取文件
//    var filePath = PATH + type + '.json';
//    fs.readFile(filePath, function(err, data){
//        if(err){
//            return res.send({
//                status: 0,
//                info: '读取文件失败!'
//            });
//        }
//	    var arr = JSON.parse(data.toString());
//	    //代表每一条记录
//	    var obj = {
//		    img: xss(img),
//		    url: xss(url),
//		    title: xss(title),
//		    id: guidGenerate(),
//		    time: new Date()
//	    };
//	    arr.splice(0, 0, obj);
//	    //（2）写入文件
//	    var newData = JSON.stringify(arr);
//	    fs.writeFile(filePath, newData, function(err){
//		    if(err){
//			    return res.send({
//				    status: 0,
//				    info: '写入文件失败!'
//			    });
//		    }
//		    return res.send({
//			    status: 1,
//			    data: obj
//		    });
//	    });
//    });
//});


//阅读模块写入接口
router.post('/write_config', function(req, res, next){
	if(!req.session.user){
		return res.send({
			status: 0,
			info: '未鉴权认证'
		});
	}
    //TODO: 后期进行提交数据的验证
    //防xss攻击
    // npm install xss --save
    // require('xss')
    // var str = xss(name);
    var data = req.body.data;
    //TODO: try catch
    var obj = JSON.parse(xss(data));
    var newData = JSON.stringify(obj);
    //写入文件
    fs.writeFile(PATH + 'config.json', newData, function(err){
        if(err){
            return res.send({
                status: 0,
                info: '写入文件失败!'
            });
        }
        return res.send({
            status: 1,
            info: obj
        });
    });
});


//登录接口
router.post('/login', function(req, res, next){
	//用户名，密码，验证码
	var username = xss(req.body.username);
	var password = xss(req.body.password);

	//TODO：对用户名，密码进行校验
	//xss处理，判空

	//密码加密，md5(password + '随机字符串')
	//密码需要加密后可以写入json文件
	if(username === 'admin' && password === '123456'){
		req.session.user = {
			username: username
		};
		return res.send({
			status: 1
		});

		return res.send({
			status: 0,
			info: '登录失败'
		});
	}
});



module.exports = router;

/**
 * 路由跳转配置
 * @type {*|exports|module.exports}
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');

var Data = require("../models/data.model");

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.user){
	    return res.render('login', {});
    }
	res.render('index', {});
});

router.get('/login', function(req, res, next) {
	return res.render('login', {});
});

router.get('/tuijian', function(req, res, next) {
	if(!req.session.user){
		return res.render('login', {});
	}
	res.render('tuijian', {});
});

router.get('/edit/type/:type', function(req, res, next) {
	if(!req.session.user){
		return res.render('login', {});
	}
	var type = req.params.type;
	if(type){
		var obj = {};
		switch (type){
			case 'sanwen':
				obj = {};
				break;
			case 'it':
				obj = {};
				break;
			case 'manager':
				obj = {};
				break;
			case 'cookies':
				obj = {};
				break;
			default:
				return res.send({
					status: 0,
					info: '参数错误'
				});
				break;
		}
		//fs.readFile(PATH + type + '.json', (err, data) => {
		//	if(err){
		//		return res.send({
		//			status: 0,
		//			info: 'fail....'
		//		});
		//	}
		//	var obj = JSON.parse(data.toString());
		//	return res.render('edit', {
		//		data: obj
		//	});
		//});
		//渲染页面
		Data.fetch(function(err,data){
			if(err){
				console.log(err)
			}

			//渲染页面
			return res.render('edit', {
				data: obj
			});
		});
	}else {
		return res.send({
			status: 0,
			info: '参数错误'
		});
	}
});

module.exports = router;
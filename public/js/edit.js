(function(global){
	//function getQueryString(name) {
	//	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	//	var r = window.location.search.substr(1).match(reg);
	//	if (r != null){
     //       return encodeURI(r[2]);
     //   }
     //   return null;
	//}
    //
	//var type = getQueryString('type');

    var urlArr = window.location.pathname.split("/");
    var type = urlArr[3];

	$('.addinfo_btn').on('click', function(){
		if(!type){
			return;
		}
		var title = $('#title').val();
		var url = $('#url').val();
		var img = $('#img').val();
		var obj = {
			type: filterXSS(type),
			title: filterXSS(title),
			url: filterXSS(url),
			img: filterXSS(img)
		};
        if(!type || !url || !title || !img){
            return alert("提交的字段不全");
        }
		$.ajax({
			type: 'POST',
			url: '/api/write/type/'+type,
            dataType: 'json',
			data: obj,
			success: function(data){
				if(data.status){
					alert('添加数据成功');
					window.location.reload();
				}else{
					alert('添加失败');
				}
			},
			error: function(){
				alert('添加失败');
			}
		});
	});
})(window);
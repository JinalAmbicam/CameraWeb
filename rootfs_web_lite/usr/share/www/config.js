//cookie
//声明配置值
var config = {};
//版本号
//全局
config.stage = {};
//开启Debug
//启用js动画
//系统
//定义html地址
//影配置

var sharpen=0;
var hue=0;
var saturation=0;
var brightness=0;
var contrast=0;

var strength=0;
var ae_compensation=0;
var denoise_strength=0;

$(window).ready(function(){
//	alert("窗体加载完毕，开始绑定函数");
	//预热舞台
	readyStage();
	
	//重载舞台
	stageResize();

	//插件启动
	var ip=document.location.host;
	var port=document.location.port;
	if(port=="")	//80
	{
	port=80;
	}
	else{
	var i=document.location.host.indexOf(":");
	ip=document.location.host.substring(0,i);
	}

	//开启本地时间
	setTimeout("renewtime()",10);
	// $(".m_date").datepicker({
	//      showButtonPanel: true
    // });
	
	$('.in').each(function(index){
			$(this).focusout(function() {
				if($(this).val() == ''){
					alert('输入不能为空');
					}
			});
			$(this).focus(function(){
				$(this).val('');
			});
			$(this).keyup(function(){
				var str = $(this).val();
				if(index == 0){
					if(str.length == 1){
						if(str > 2){
							$(this).val('2');	
						}	
					}
					else{
						if(str.slice(0,1) == '2'){
							if(str.slice(1,2) > 4){
								$(this).val(str.slice(0,1)+'3');
							}
						}
					}
				}
				else{
					if(str.length == 1){
						if(str > 6){
							$(this).val('5');
						}	
					}	
				}
				if($(this).val().length == 2){
					$('.in').eq(index + 1).focus();	
				}
		});	
	});	
	$('.mask_ipcam').css('padding-top',$('.mask_ipcam').height()/2-60+'px');
}).resize(function(){
	stageResize();
	
});

//舞台自适应
/*function stageResize(){
	$('#ipcam_display,.mask_ipcam,#JaViewer_view').height($(window).height()-186);
	$('.window-preview').height($(window).height()-150).width($(window).width() - 436).css('top','98px');
	if($('.window-preview').height() < 447){
		$('.window-preview').height(447);
		$('#ipcam_display,.mask_ipcam,#JaViewer_view').height(422);
	}
	if($('.window-preview').width() < 600){
		$('.window-preview').width(600)
		}

};*/
function stageResize(){
	$('#ipcam_display,.mask_ipcam,#JaViewer_view').height(540).width(960);
	/*$('#ipcam_display,.mask_ipcam,#JaViewer_view').height($(window).height()-206).width($(window).width() - 456);
	if($('.window-preview').height() < 447){
		$('#ipcam_display,.mask_ipcam,#JaViewer_view').height(422);
	}
	if($('.window-preview').width() < 600){
		$('#ipcam_display,.mask_ipcam,#JaViewer_view').width(600);
		}*/
};


//预热舞台
function readyStage(){
	//预览/配置标签
	// $('#logo-config').children('span').eq(0).css({"width":"50px","height":"52px","line-height":"52px","margin-top":"3px","color":"#666666","font-size":"20px","border-bottom":"0"});			
	// $('.logo-inactive').click(function(){
	// 	$('#logo-config').children().css({"width":"58px","height":"40px","line-height":"40px","margin-top":"15px","color":"#ccc","font-size":"20px","border-bottom":"1px solid #CCC"});
	// 	$(this).css({"width":"100px","height":"52px","line-height":"52px","margin-top":"15px","color":"#666666","font-size":"6px","border-bottom":"0"});
	// });
	$('#logo-config').children('span').eq(0).css({"width":"50px","height":"40px","line-height":"40px","margin-top":"15px","color":"#666666","font-weight":"bold","font-size":"20px","border-bottom":"0"});          
    $('.logo-inactive').click(function(){
        $('#logo-config').children().css({"width":"58px","height":"40px","line-height":"40px","margin-top":"15px","color":"#ccc","font-size":"20px","border-bottom":"1px solid #CCC"});
        $(this).css({"width":"100px","height":"40px","line-height":"40px","margin-top":"15px","color":"#666666","font-size":"20px","border-bottom":"1px solid #CCC"});
    });
	//切换次级菜单
	$('a.btn-left').click(function(e){
		var btn = $(this);
		var currentid = btn.attr("id");
		//获取链接
		$('a.btn-left-active').removeClass('btn-left-active')
		btn.addClass('btn-left-active');
//		showInfo('bingo!');
		//特殊标签
		$('#area-stage-left').children('span').addClass('hidden');
		$("."+currentid).removeClass('hidden');
//		hideInfo();
		bindAction();
	});
	//对应窗体显示
	$('.record_ul li').click(function(){
		var dest = $(this);
		$(".record_ul li").removeClass('submenu_current1');
		dest.addClass('submenu_current1');
	})
	$('.mainMenu').click(function(){
		var dest = $(this);
		var destmark = dest.attr("id");
		$("ul li").removeClass('submenu_current');
		dest.parent().addClass('submenu_current');
		$('#area-stage-right').children('div').addClass('hidden');
		$("."+destmark).removeClass('hidden');
		if(destmark == "video")
		{
			encode_load_content();
		}
		else if(destmark == "image")
		{
			image_load_content();
		}
		else if(destmark == "local-network")
		{
			local_load_content();
		}
		else if(destmark == "remote-network")
		{
			remote_load_content();
		}
		else if(destmark == "danale")
		{
			danale_load_content();
		}
		else if(destmark == "time")
		{
			time_zone_load();
		}
		else if(destmark == "devinfo")
		{
			devinfo_load_content(true);
		}
		else if(destmark == "user-management")
		{
			user_management_load_content();
		}
		else if(destmark =="record")
		{
			//record_load_content();
		}
		else if(destmark == "playback")
		{
			playback_load_content();
		}
		else if(destmark =="isp")
		{
			isp_load_content();
		}
		else if(destmark =="cover")
		{
			cover_load_content();
		}
		else if(destmark =="overlay")
		{ 
			overlay_load_content();
		}
		else if(destmark =="wireless")
		{ 
			wireless_load_content();
		}
		else if(destmark =="rtmp")
		{ 
			rtmp_load_content();
		}
		else if(destmark == "setting_4G")
		{
			Setting_4G_Get_content();
		}
		else if(destmark == "local-ftp")
		{
			local_load_ftp();
		}
		else if(destmark == "motion_detection")
		{
			motion_detection_load_content();
		} else if(destmark == "ptz-setting") {
			ptz_argument_load_content();
		} else if (destmark == "AIDetect") {
			AIDetect_load_content();
		}else if(destmark == 'Line_Crossing_Detection'){
			Line_Crossing_Detection()
		}else if(destmark == 'Intrusion_Analysis'){
			Intrusion_Analysis()
		}else if(destmark == 'Unatttended_baggage'){
			Unatttended_baggage()
		}else if(destmark == 'Missing_object'){
			Missing_object()
		}else if(destmark == 'Humanoid_detection'){
			Humanoid_detection()
		}else if(destmark == 'Face_detection'){
			Face_detection()
		}else if(destmark == 'Customer_traffic_statistics'){
			Customer_traffic_statistics()
		}
	});
	ptz_speed_level_load();
	//表格上色&排版
	$(".table-common").find("tr:even").children('td').css("background-color","#F1F1F1");
	$(".marker").css("padding-left","5px");
	//CAM HOVER
	$('#ptz-controller-cam').hover(function(){$(this).css("background-image","url(images/ptz-controller-cam-hover.png)");},function(){$(this).css("background-image","url(images/ptz-controller-cam.png)");});
	//PTZ EXPANSION
	// $('#consoler').mouseenter(function()
	// {
	// 	$('#ptz-controller-up').stop(true,true).css({"opacity":0 , "top":"48px"}).animate({"opacity":1 , "top":"10px"},200);
	// 	$('#ptz-controller-left').stop(true,true).css({"opacity":0 , "left":"48px"}).animate({"opacity":1 , "left":"10px"},200);
	// 	$('#ptz-controller-right').stop(true,true).css({"opacity":0 , "left":"48px"}).animate({"opacity":1 , "left":"102px"},200);
	// 	$('#ptz-controller-down').stop(true,true).css({"opacity":0 , "top":"48px"}).animate({"opacity":1 , "top":"102px"},200);
	// });
	//PTZ PACK
	// $('#consoler').mouseleave(function()
	// {
	// 	$('#ptz-controller-up').animate({"opacity":0 , "top":"-48px"},200,function(){$(this).css({"top":"48px"});});	
	// 	$('#ptz-controller-left').animate({"opacity":0 , "left":"-48px"},200,function(){$(this).css({"left":"48px"});});	
	// 	$('#ptz-controller-right').animate({"opacity":0 , "left":"144px"},200,function(){$(this).css({"left":"48px"});});	
	// 	$('#ptz-controller-down').animate({"opacity":0 , "top":"144px"},200,function(){$(this).css({"top":"48px"});});	
	// });
	//PTZ ARROW HOVER
	$('#ptz-controller-up').hover(function(){$(this).css("background-image","url(images/up_hover.png)");},function(){$(this).css("background-image","url(images/up.png)");});
    $('#ptz-controller-left').hover(function(){$(this).css("background-image","url(images/left_hover.png)");},function(){$(this).css("background-image","url(images/left.png)");});
    $('#ptz-controller-right').hover(function(){$(this).css("background-image","url(images/right_hover.png)");},function(){$(this).css("background-image","url(images/right.png)");});
    $('#ptz-controller-down').hover(function(){$(this).css("background-image","url(images/down_hover.png)");},function(){$(this).css("background-image","url(images/down.png)");});
    
    //Zoom in/out
    $('#zoom-in').hover(function(){$(this).css("background-image","url(images/zoom-in-hover.png)");},function(){$(this).css("background-image","url(images/zoom-in.png)");});
    $('#zoom-out').hover(function(){$(this).css("background-image","url(images/zoom-out-hover.png)");},function(){$(this).css("background-image","url(images/zoom-out.png)");});

    $('#focus-in').hover(function(){$(this).css("background-image","url(images/zoom-in-hover.png)");},function(){$(this).css("background-image","url(images/zoom-in.png)");});
    $('#focus-out').hover(function(){$(this).css("background-image","url(images/zoom-out-hover.png)");},function(){$(this).css("background-image","url(images/zoom-out.png)");});

    $('#aperture-in').hover(function(){$(this).css("background-image","url(images/zoom-in-hover.png)");},function(){$(this).css("background-image","url(images/zoom-in.png)");});
    $('#aperture-out').hover(function(){$(this).css("background-image","url(images/zoom-out-hover.png)");},function(){$(this).css("background-image","url(images/zoom-out.png)");});
    $('#ptz_input').val(ptz_input_init);
    //Others
    //$(".w_imagebtn").eq(0).hover(function(){$(this).css("background-image","url(images/record-hover.png)");},function(){$(this).css("background-image","url(images/record.png)");});
    //$(".w_imagebtn").eq(1).hover(function(){$(this).css("background-image","url(images/playback-hover.png)");},function(){$(this).css("background-image","url(images/playback.png)");});
    // $(".w_imagebtn").eq(0).hover(function(){$(this).css("background-image","url(images/stream-change-hover.png)");},function(){$(this).css("background-image","url(images/stream-change.png)");});
    // $(".w_imagebtn").eq(1).hover(function(){$(this).css("background-image","url(images/stream-change-hover.png)");},function(){$(this).css("background-image","url(images/stream-change.png)");});
    // $(".w_imagebtn").eq(2).hover(function(){$(this).css("background-image","url(images/stream-change-hover.png)");},function(){$(this).css("background-image","url(images/stream-change.png)");});
    // $(".w_imagebtn").eq(3).hover(function(){$(this).css("background-image","url(images/stream-change-hover.png)");},function(){$(this).css("background-image","url(images/stream-change.png)");});

    var url = self.location.href.match(/\=.*/);

};

//绑定动作
function bindAction(){	
	//选择框动作	
		//判断是否是默认值		
		//点击动作		
			//切换状态
			$(this).parent().toggleClass('changed');
			//更改标题栏		
};


//获取一个随机数值
function setMid() {
	//获取暂存索引
	var mid = Math.random().toString().replace(/\./, '');
	//返回数值
	return mid;
};

//将Json转化为字符串
function parseString(para){
	var mimikoString = JSON && typeof(para) != 'string' ? JSON.stringify(para) : para;
	return mimikoString;
};

//将一个字符串转换为Json
function parseJson(para){
	var mimikoJson = typeof(para) != 'object' ? $.parseJSON(para) : para;
	return mimikoJson;
};

//显示信息
function showInfo(para, callback){
	if(!$('#txtLoadinInfo').length){
		$('#message_here').append('<span id="txtLoadinInfo">' + para +'</span>');
	}else
	{
		$('#txtLoadinInfo')[0].innerText = para;
	};
	$('#txtLoadinInfo').stop(false, true).css({
		opacity:0
	}).animate({
		opacity:1
	},250, function(){
		if ($.isFunction(callback)) {
			callback();
		};
	});
};

//隐藏信息
function hideInfo(para){
	window.setTimeout(function(){
		$('#txtLoadinInfo').stop(false, true).animate({
			opacity:0
		}, 250, function(){
			$(this).remove();
		});
	}, para);
};

//Azrael的试管
//本地时间函数
var yy,mm,dd,hh,mi,ss;
var init_set_time = false
function renewtime()
{
    var myDate = new Date();
	yy=myDate.getFullYear().toString();
	if (yy.length<4)
	{
		var i = 4-yy.length;
		for (var j = 0; j < i; j++)
		{
			yy = "0" + yy;
		}
	}
	mm=(myDate.getMonth()+parseInt(1)).toString();
	mm=(mm.length==1)?("0"+mm):mm
	dd=myDate.getDate().toString();
	dd=(dd.length==1)?("0"+dd):dd
	hh=myDate.getHours().toString();
	hh=(hh.length==1)?("0"+hh):hh
	mi=myDate.getMinutes().toString();
	mi=(mi.length==1)?("0"+mi):mi
	ss=myDate.getSeconds().toString();
	ss=(ss.length==1)?("0"+ss):ss
	$('#time_pc')[0].value = yy + "-" + mm + "-" + dd + "  " + hh + ":" + mi + ":" + ss;
	
	setTimeout("renewtime()",100);
	if(!init_set_time){
		$('.m_date').val(yy + "-" + mm + "-" + dd);
		$('.in').eq(0).val(hh).end().eq(1).val(mi).end().eq(2).val(ss);
		init_set_time = true;
	}
}
//主次码流预览标签
var stream_state = 1;
function preview_stream()
{
	if (stream_state == 1)
	{
		$('.window-preview').children('.title-window')[0].innerHTML = langstr.main_stream;
		stream_state = 0;
		streamchange(stream_state);
	}else if (stream_state == 0)
	{
		$('.window-preview').children('.title-window')[0].innerHTML = langstr.sub_stream;
		stream_state = 1;
		streamchange(stream_state);
	}
}
function pic_btn_down()
{
	location.href = "playback.html";
}
//音频开关
var Switch = true;
function AudioSwitch()
{
	if (Switch == true)
	{
		$('#Audio_change')[0].innerHTML = langstr.audio_off;
		Switch = false;
		audiochange(Switch);
	}else if (Switch == false)
	{
		$('#Audio_change')[0].innerHTML = langstr.audio_on;
		Switch = true;
		audiochange(Switch);
	}
}

//升级界面动画
function showBg()
{  
//	var bh = $("body").height();  
//	var bw = $("body").width();  
//	$("#maskbg").css({ height:bh, width:bw, display:"block" });  
	$("#maskbg").fadeIn(200);
	$("#update_process").fadeIn(400);  
}   
function closeBg() {  
	$("#maskbg,#update_process").fadeOut();  
}  

//预览配置切换函数
function cslshine(tips)
{
	var DHiMPlayer_image = document.getElementById('DHiMPlayer_image');
	var DHiMPlayer = document.getElementById('DHiMPlayer');
	switch(tips)
	{
		case 0: 
			$('#consoler').show(); 
			$('#area-stage-left').hide();
			$('#area-stage-right').hide();
			$('#area-stage-help').hide();
			$('.window-preview').show();
			if(stream_state==0){
				setTimeout("flash_video(\"JaViewer_view\", \"720p.264\")", 1000);
			}else if(stream_state == 1){
				setTimeout("flash_video(\"JaViewer_view\", \"360p.264\")", 1000);
			}else{
				setTimeout("flash_video(\"JaViewer_view\", \"720p.264\")", 1000);
			}
			if(DHiMPlayer_image){
				DHiMPlayer_image.close();
			}
			if(DHiMPlayer){
				DHiMPlayer.OpenByIP(g_ip,g_port);
				DHiMPlayer.UserLogon(g_usr,g_pwd);
				DHiMPlayer.OpenChannel(0,stream_state);
			}
			//load1();
			break;
		case 1: 
			if(DHiMPlayer){
				DHiMPlayer.close();
			}
			/*if(DHiMPlayer_image){
				DHiMPlayer_image.OpenByIP(g_ip,g_port);
				DHiMPlayer_image.UserLogon(g_usr,g_pwd);
				DHiMPlayer_image.OpenChannel(0,1);
			}*/
			encode_load_content();
			$('#consoler').hide(); 
			$('#area-stage-left').show(); 
			$('.window-preview').hide();
			$('#area-stage-right').show();
			$('#area-stage-help').show();
				$('a.btn-left-active').removeClass('btn-left-active')
				$("#video-image").addClass('btn-left-active');
				$('#area-stage-left').children('span').addClass('hidden');
				$(".video-image").removeClass('hidden');
				$("ul li").removeClass('submenu_current');
				$("#video").parent().addClass('submenu_current');
				setTimeout("$('#area-stage-right').children('div').addClass('hidden');$('.video').removeClass('hidden');",50);	
				setTimeout("video_preload_content()",55);			
			break;
		case 2: 
			if(DHiMPlayer){
				DHiMPlayer.close();
			}
			// $('#logo-config').children().css({"width":"58px","height":"40px","line-height":"40px","margin-top":"35px","color":"#ccc","font-size":"20px","border-bottom":"1px solid #CCC"});
			// $('#logo-inactive1').css({"width":"100px","height":"52px","line-height":"52px","margin-top":"3px","color":"#666666","font-size":"26px","border-bottom":"0"});
			$('#consoler').hide(); 
			$('#area-stage-left').show(); 
			$('.window-preview').hide();
			$('#area-stage-right').show();
			$('#area-stage-help').show();
				$('a.btn-left-active').removeClass('btn-left-active')
				$("#advanced").addClass('btn-left-active');
				$('#area-stage-left').children('span').addClass('hidden');
				$(".advanced").removeClass('hidden');
				$("ul li").removeClass('submenu_current');
				$("#playback").parent().addClass('submenu_current');
				setTimeout("$('#area-stage-right').children('div').addClass('hidden');$('.playback').removeClass('hidden');",50);	
				setTimeout("playback_load_content()",55);			
			break;
		default: 
			$('#consoler').hide(); 
			$('#area-stage-left').show();
	}
}

function toPlayBack() {
	const playbackUrl = "./playback.html";
	window.location.href=playbackUrl
//    var tmp = window.open("about:blank","","")
//    tmp.location = playbackUrl
}

//拌线入侵
function Line_Crossing_Detection(){
        InitLineCanvas('Lcd_image')
        clearPaint()
        //获取截图
        let imgAuth = base64.encode(g_usr+':'+g_pwd);
        let snap = Math.random();
        let imgUrl = `${dvr_url}/snapshot?r=${snap}&auth=${imgAuth}`
        // let imgUrl = '../images/snapshot.png'
        $('#Lcd_image').css('background-image',`url(${imgUrl})`)
        var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
        $.ajax({
            type:"GET",
            url:dvr_url + "/NetSdk/V2/AI/LineCrossDetect",
            dataType:"json",
            beforeSend : function(req){ 
                req.setRequestHeader('Authorization', auth);
            },
            success:function(data){
                drawLine(data.Direction,data.DetectLine)
                document.getElementById('Line_Crossing_Detection_enable').checked = data.Enabled
                document.getElementById('Lcd_Enable_alarn_sound').checked = data.AlarmOut.AudioAlert.Enabled
                document.getElementById('Lcd_Enable_white_light_alarm').checked = data.AlarmOut.LightAlert.Enabled
                document.getElementById('Lcd_Enable_App_message_push').checked = data.AlarmOut.AppPush.Enabled
                document.getElementById('Lcd_Enable_Rtmp_push').checked = data.AlarmOut.RtmpPush.Enabled
                document.getElementById('Lcd_Enable_Ftp_push').checked  = data.AlarmOut.FtpPush.Enabled
                document.getElementById('Lcd_Direation').value = data.Direction
                // document.getElementById('Lcd_SensitivityLevel').value = data.Sensitivity
            }   
        });

}
// 拌线入侵保存
function Line_Crossing_Detection_Save(){
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    let sendData = {
        Enabled:document.getElementById('Line_Crossing_Detection_enable').checked,
        DetectLine: DetectLine.length === 0 ?  [ [ 0, 0 ], [ 0 , 0 ] ] : DetectLine,
        DetectObj:'Human',
        Direction,
        // Sensitivity: Number(document.getElementById('Lcd_SensitivityLevel').value),
        AlarmOut:{
            AudioAlert: { Enabled: document.getElementById('Lcd_Enable_alarn_sound').checked },
            LightAlert: { Enabled: document.getElementById('Lcd_Enable_white_light_alarm').checked },
            AppPush: { Enabled: document.getElementById('Lcd_Enable_App_message_push').checked },
            RtmpPush:{ Enabled: document.getElementById('Lcd_Enable_Rtmp_push').checked  },
            FtpPush:{ Enabled: document.getElementById('Lcd_Enable_Ftp_push').checked  }
        }
    }
    let data = JSON.stringify(sendData)
    $.ajax({
        type:'PUT',
        url:dvr_url + "/NetSdk/V2/AI/LineCrossDetect",
        dataType:'json',
        data: data,
        beforeSend : function(req ) {
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){ 
            showInfo(langstr.save_success);
            setTimeout("hideInfo()",hide_delaytime_ms);
        },
        error:function(){ 
            
        }
    })
}

// 区域检测
function Intrusion_Analysis(){
    let imgAuth = base64.encode(g_usr+':'+g_pwd);
	let snap = Math.random();
	let imgUrl = `${dvr_url}/snapshot?r=${snap}&auth=${imgAuth}`
    // let imgUrl = '../images/snapshot.png'
	$('#canvasBox').css('background-image',`url(${imgUrl})`)
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
	$.ajax({
		type:"GET",
		url:dvr_url + "/NetSdk/V2/AI/RegionDetect",
		dataType:"json",
		beforeSend : function(req){ 
			req.setRequestHeader('Authorization', auth);
		},
		success:function(data){
            InitPolygonCanvas('Ia_canvas','Ia_canvasTemp',data.Direction,data.Action,'canvasBox')
            handleForeignData(data.DetectRegion)
            document.getElementById('Intrusion_Analysis_enable').checked = data.Enabled
			document.getElementById('Ia_Enable_alarn_sound').checked = data.AlarmOut.AudioAlert.Enabled
			document.getElementById('Ia_Enable_white_light_alarm').checked = data.AlarmOut.LightAlert.Enabled
			document.getElementById('Ia_Enable_App_message_push').checked = data.AlarmOut.AppPush.Enabled
            document.getElementById('Ia_Enable_Rtmp_push').checked = data.AlarmOut.RtmpPush.Enabled
            document.getElementById('Ia_Enable_Ftp_push').checked = data.AlarmOut.FtpPush.Enabled
			document.getElementById('Ia_SensitivityLevel').value = data.Sensitivity
            document.getElementById('Ia_MinimumDurations').value = data.MinDuration
            document.getElementById('Ia_Action').value = data.Action
            document.getElementById('Ia_Direation').value = data.Direction
            document.getElementById('Ia_RepeatAlarm').value = data.RepeatAlarmTime
		}
		
	});
}

// 保存区域检测
function Intrusion_Analysis_Save(){
    let DetectRegion = []
    pointList.map((item)=>{
        let DetectRegionItem = [ Math.round((item.x /Ia_canvasWidth)*10000), Math.round((item.y/Ia_canvasHeight)*10000) ]
        DetectRegion.push(DetectRegionItem)
    })
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    let sendData = {
        Enabled:document.getElementById('Intrusion_Analysis_enable').checked,
        DetectRegion: DetectRegion.length === 0 ? [[0,0],[0,0],[0,0],[0,0]] : DetectRegion,
        DetectObj:["Human"],
        Action:document.getElementById('Ia_Action').value,
        Direction:document.getElementById('Ia_Direation').value,
        MinDuration: Number(document.getElementById('Ia_MinimumDurations').value),
        RepeatAlarmTime: Number(document.getElementById('Ia_RepeatAlarm').value) ,
        Sensitivity: Number(document.getElementById('Ia_SensitivityLevel').value),
        AlarmOut:{
            AudioAlert: { Enabled: document.getElementById('Ia_Enable_alarn_sound').checked },
            LightAlert: { Enabled: document.getElementById('Ia_Enable_white_light_alarm').checked },
            AppPush: { Enabled: document.getElementById('Ia_Enable_App_message_push').checked },
            RtmpPush:{ Enabled: document.getElementById('Ia_Enable_Rtmp_push').checked  },
            FtpPush:{ Enabled: document.getElementById('Ia_Enable_Ftp_push').checked  }
        }
    }
    let data = JSON.stringify(sendData)
    $.ajax({
        type:'PUT',
        url:dvr_url + "/NetSdk/V2/AI/RegionDetect",
        dataType:'json',
        data: data,
        beforeSend : function(req ) {
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){ 
            showInfo(langstr.save_success);
            setTimeout("hideInfo()",hide_delaytime_ms);
        },
        error:function(){ 
            
        }
    })
}
// 物品滞留检测
function Unatttended_baggage(){
    let imgAuth = base64.encode(g_usr+':'+g_pwd);
	let snap = Math.random();
	let imgUrl = `${dvr_url}/snapshot?r=${snap}&auth=${imgAuth}`
    // let imgUrl = '../images/snapshot.png'
	$('#UbcanvasBox').css('background-image',`url(${imgUrl})`)
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    $.ajax({
        type:"GET",
        url:dvr_url + "/NetSdk/V2/AI/UnattendedObjDetect",
        dataType:"json",
        beforeSend : function(req){ 
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){
            InitPolygonCanvas('Ub_canvas','Ub_canvasTemp','','Inside','UbcanvasBox')
            handleForeignData(data.DetectAera)
            document.getElementById('Unatttended_baggage_enable').checked = data.Enabled
            document.getElementById('Ub_Enable_alarn_sound').checked = data.AlarmOut.AudioAlert.Enabled
            document.getElementById('Ub_Enable_white_light_alarm').checked = data.AlarmOut.LightAlert.Enabled
            document.getElementById('Ub_Enable_App_message_push').checked = data.AlarmOut.AppPush.Enabled
            document.getElementById('Ub_Enable_Rtmp_push').checked = data.AlarmOut.RtmpPush.Enabled
            document.getElementById('Ub_Enable_Ftp_push').checked  = data.AlarmOut.FtpPush.Enabled
            document.getElementById('Ub_MinimumDurations').value = data.Duration
            document.getElementById('Ub_SensitivityLevel').value = data.Sensitivity
        }   
    });
}
// 保存物品滞留检测
function saveUnatttendedbaggageSettings(){
    let DetectAera = []
    pointList.map((item)=>{
        let DetectRegionItem = [ Math.round((item.x /Ia_canvasWidth)*10000), Math.round((item.y/Ia_canvasHeight)*10000) ]
        DetectAera.push(DetectRegionItem)
    })
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    let sendData = {
        Enabled:document.getElementById('Unatttended_baggage_enable').checked,
        Duration: Number( document.getElementById('Ub_MinimumDurations').value ),
        DetectAera: DetectAera.length === 0 ? [[0,0],[0,0],[0,0],[0,0]] : DetectAera,
        Sensitivity: Number( document.getElementById('Ub_SensitivityLevel').value ),
        AlarmOut:{
            AudioAlert: { Enabled: document.getElementById('Ub_Enable_alarn_sound').checked },
            LightAlert: { Enabled: document.getElementById('Ub_Enable_white_light_alarm').checked },
            AppPush: { Enabled: document.getElementById('Ub_Enable_App_message_push').checked },
            RtmpPush:{ Enabled: document.getElementById('Ub_Enable_Rtmp_push').checked  },
            FtpPush:{ Enabled: document.getElementById('Ub_Enable_Ftp_push').checked  }
        }
    }
    let data = JSON.stringify(sendData)
    $.ajax({
        type:'PUT',
        url:dvr_url + "/NetSdk/V2/AI/UnattendedObjDetect",
        dataType:'json',
        data: data,
        beforeSend : function(req ) {
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){ 
            showInfo(langstr.save_success);
            setTimeout("hideInfo()",hide_delaytime_ms);
        },
        error:function(){ 
            
        }
    })
}
// 物品移除检测
function Missing_object(){
    let imgAuth = base64.encode(g_usr+':'+g_pwd);
	let snap = Math.random();
	let imgUrl = `${dvr_url}/snapshot?r=${snap}&auth=${imgAuth}`
    // let imgUrl = '../images/snapshot.png'
	$('#MisscanvasBox').css('background-image',`url(${imgUrl})`)
    $('#UbcanvasBox').css('background-image',`url(${imgUrl})`)
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    $.ajax({
        type:"GET",
        url:dvr_url + "/NetSdk/V2/AI/ObjRemoveDetect",
        dataType:"json",
        beforeSend : function(req){ 
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){
            InitPolygonCanvas('Miss_canvas','Miss_canvasTemp','','Inside','MisscanvasBox')
            handleForeignData(data.DetectAera)
            document.getElementById('Missing_object_enable').checked = data.Enabled
            document.getElementById('Miss_Enable_alarn_sound').checked = data.AlarmOut.AudioAlert.Enabled
            document.getElementById('Miss_Enable_white_light_alarm').checked = data.AlarmOut.LightAlert.Enabled
            document.getElementById('Miss_Enable_App_message_push').checked = data.AlarmOut.AppPush.Enabled
            document.getElementById('Miss_Enable_Rtmp_push').checked = data.AlarmOut.RtmpPush.Enabled
            document.getElementById('Miss_Enable_Ftp_push').checked  = data.AlarmOut.FtpPush.Enabled
            document.getElementById('Miss_MinimumDurations').value = data.Duration
            document.getElementById('Miss_SensitivityLevel').value = data.Sensitivity
        }   
    });
}
// 保存物品移除检测
function saveMissingObjectySettings(){
    let DetectAera = []
    pointList.map((item)=>{
        let DetectRegionItem = [ Math.round((item.x /Ia_canvasWidth)*10000), Math.round((item.y/Ia_canvasHeight)*10000) ]
        DetectAera.push(DetectRegionItem)
    })
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    let sendData = {
        Enabled:document.getElementById('Missing_object_enable').checked,
        Duration: Number( document.getElementById('Miss_MinimumDurations').value ),
        DetectAera: DetectAera.length === 0 ? [[0,0],[0,0],[0,0],[0,0]] : DetectAera,
        Sensitivity: Number( document.getElementById('Miss_SensitivityLevel').value ),
        AlarmOut:{
            AudioAlert: { Enabled: document.getElementById('Miss_Enable_alarn_sound').checked },
            LightAlert: { Enabled: document.getElementById('Miss_Enable_white_light_alarm').checked },
            AppPush: { Enabled: document.getElementById('Miss_Enable_App_message_push').checked },
            RtmpPush:{ Enabled: document.getElementById('Miss_Enable_Rtmp_push').checked  },
            FtpPush:{ Enabled: document.getElementById('Miss_Enable_Ftp_push').checked  }
        }
    }
    let data = JSON.stringify(sendData)
    $.ajax({
        type:'PUT',
        url:dvr_url + "/NetSdk/V2/AI/ObjRemoveDetect",
        dataType:'json',
        data: data,
        beforeSend : function(req ) {
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){ 
            showInfo(langstr.save_success);
            setTimeout("hideInfo()",hide_delaytime_ms);
        },
        error:function(){ 
            
        }
    })
}
// 人形检测
function Humanoid_detection(){
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
	$.ajax({
		type:"GET",
		url:dvr_url + "/NetSdk/V2/AI/HumanDetect",
		dataType:"json",
		beforeSend : function(req){ 
			req.setRequestHeader('Authorization', auth);
		},
		success:function(data){ 
            document.getElementById('Humanoid_detection_enable').checked = data.Enabled
			document.getElementById('Hd_Enable_alarn_sound').checked = data.AlarmOut.AudioAlert.Enabled
			document.getElementById('Hd_Enable_white_light_alarm').checked = data.AlarmOut.LightAlert.Enabled
			document.getElementById('Hd_Enable_App_message_push').checked = data.AlarmOut.AppPush.Enabled
            document.getElementById('Hd_Enable_Rtmp_push').checked = data.AlarmOut.RtmpPush.Enabled
            document.getElementById('Hd_Enable_Ftp_push').checked = data.AlarmOut.FtpPush.Enabled
            document.getElementById('Hd_Enable_drawRegion').checked = data.spOSD
			document.getElementById('Hd_SensitivityLevel').value = data.Sensitivity
		}
	});
}
// 保存人形检测
function SaveHumanoidDetectionSettings(){
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    let sendData = {
        Enabled:document.getElementById('Humanoid_detection_enable').checked,
        spOSD:document.getElementById('Hd_Enable_drawRegion').checked,
        Sensitivity: Number(document.getElementById('Hd_SensitivityLevel').value),
        AlarmOut:{
            AudioAlert: { Enabled: document.getElementById('Hd_Enable_alarn_sound').checked },
            LightAlert: { Enabled: document.getElementById('Hd_Enable_white_light_alarm').checked },
            AppPush: { Enabled: document.getElementById('Hd_Enable_App_message_push').checked },
            RtmpPush:{ Enabled: document.getElementById('Hd_Enable_Rtmp_push').checked  },
            FtpPush:{ Enabled: document.getElementById('Hd_Enable_Ftp_push').checked  }
        }
    }
    let data = JSON.stringify(sendData)
    $.ajax({
        type:'PUT',
        url:dvr_url + "/NetSdk/V2/AI/HumanDetect",
        dataType:'json',
        data: data,
        beforeSend : function(req ) {
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){ 
            showInfo(langstr.save_success);
            setTimeout("hideInfo()",hide_delaytime_ms);
        },
        error:function(){ 
            
        }
    })
}
// 人脸检测
function Face_detection(){
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
	$.ajax({
		type:"GET",
		url:dvr_url + "/NetSdk/V2/AI/FaceDetect",
		dataType:"json",
		beforeSend : function(req){ 
			req.setRequestHeader('Authorization', auth);
		},
		success:function(data){ 
            document.getElementById('Face_detection_enable').checked = data.Enabled
			document.getElementById('Fd_Enable_alarn_sound').checked = data.AlarmOut.AudioAlert.Enabled
			document.getElementById('Fd_Enable_white_light_alarm').checked = data.AlarmOut.LightAlert.Enabled
			document.getElementById('Fd_Enable_App_message_push').checked = data.AlarmOut.AppPush.Enabled
            document.getElementById('Fd_Enable_Rtmp_push').checked = data.AlarmOut.RtmpPush.Enabled
            document.getElementById('Fd_Enable_Ftp_push').checked = data.AlarmOut.FtpPush.Enabled
            document.getElementById('Fd_Enable_drawRegion').checked = data.spOSD
			document.getElementById('Fd_SensitivityLevel').value = data.Sensitivity
		}
	});
}

// 保存人脸检测
function SaveFaceDetectionSettings(){
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    let sendData = {
        Enabled:document.getElementById('Face_detection_enable').checked,
        spOSD:document.getElementById('Fd_Enable_drawRegion').checked,
        Sensitivity: Number(document.getElementById('Fd_SensitivityLevel').value),
        AlarmOut:{
            AudioAlert: { Enabled: document.getElementById('Fd_Enable_alarn_sound').checked },
            LightAlert: { Enabled: document.getElementById('Fd_Enable_white_light_alarm').checked },
            AppPush: { Enabled: document.getElementById('Fd_Enable_App_message_push').checked },
            RtmpPush:{ Enabled: document.getElementById('Fd_Enable_Rtmp_push').checked  },
            FtpPush:{ Enabled: document.getElementById('Fd_Enable_Ftp_push').checked  }
        }
    }
    let data = JSON.stringify(sendData)
    $.ajax({
        type:'PUT',
        url:dvr_url + "/NetSdk/V2/AI/FaceDetect",
        dataType:'json',
        data: data,
        beforeSend : function(req ) {
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){ 
            showInfo(langstr.save_success);
            setTimeout("hideInfo()",hide_delaytime_ms);
        },
        error:function(){ 
            
        }
    })
}

// 客流统计
function Customer_traffic_statistics(){
    goBackSettings()
    clearhumaCounterCanvas()
    let imgAuth = base64.encode(g_usr+':'+g_pwd);
    let snap = Math.random();
    let imgUrl = `${dvr_url}/snapshot?r=${snap}&auth=${imgAuth}`
    $('#HumanCounter_img').css('background-image',`url(${imgUrl})`)
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
	$.ajax({
		type:"GET",
		url:dvr_url + "/NetSdk/V2/AI/HumanCounter",
		dataType:"json",
		beforeSend : function(req){ 
			req.setRequestHeader('Authorization', auth);
		},
		success:function(data){ 
            initHumaCounterCanvas(data.DetectLine,data.Direction)
            document.getElementById('Customer_traffic_enable').checked = data.Enabled
            document.getElementById('Real_time_display_customer_traffic').checked = data.spOSD
            document.getElementById('Customer_traffic_statistics_direation').value = data.Direction
		}
	});
}
// 保存客流统计
function SaveCustomerTrafficStatisticsSettings(){
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    let sendData = {
        Enabled:document.getElementById('Customer_traffic_enable').checked,
        spOSD: document.getElementById('Real_time_display_customer_traffic').checked,
        DetectLine: getHumanCounterPoint(),
        DetectObj:'Human',
        Direction:getHumanCounterDirection(),
    }
    let data = JSON.stringify(sendData)
    $.ajax({
        type:'PUT',
        url:dvr_url + "/NetSdk/V2/AI/HumanCounter",
        dataType:'json',
        data: data,
        beforeSend : function(req ) {
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){ 
            showInfo(langstr.save_success);
            setTimeout("hideInfo()",hide_delaytime_ms);
        },
        error:function(){ 
            
        }
    })
}
// 客流统计数据查询
function Customer_traffic_statistics_search(){
    var auth = "Basic " + base64.encode(g_usr+':'+g_pwd);
    let sendData = {
        SearchMon: new Date().toISOString().substr(0, 7)
    }
    let data = JSON.stringify(sendData)
    $.ajax({
        type:'POST',
        url:dvr_url + "/netsdk/v2/R/HDCounter",
        dataType:'json',
        data: data,
        beforeSend : function(req ) {
            req.setRequestHeader('Authorization', auth);
        },
        success:function(data){ 
            changeHumanCounterDate(data.datas)
            echartHumanCounterMonthly()
        },
        error:function(error){ 
            changeHumanCounterDate([])
            echartHumanCounterMonthly()
        }
    })
}
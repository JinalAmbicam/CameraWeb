    var $container = document.getElementById('container');
	var $imgSettingVideo =  document.getElementById('imgSettingVideo')
	var $imghadleVideo =  document.getElementById('imghadleVideo')
    var showOperateBtns = true; // 是否显示按钮
    var forceNoOffscreen = true; //
    var jessibucaLive = null; //直播播放器
	var jessibucaImgSetting = null //图像设置播放器
	var jessibucaimghadleVideo = null
    var streamType = 1 //0主码流 1子码流
    var timerLive = null
    var currentMenu = 0
    var Live_canvas = document.getElementById('Live_canvas')
    var Live_canvasTemp = document.getElementById('Live_canvasTemp')
    var timer
    function Encrypt(str) {
        let key = CryptoJS.enc.Utf8.parse('juanflvstreampwd'); // 密钥：一个常量，前后端协定后一个字符串即可
        let iv = CryptoJS.enc.Utf8.parse('juanflvstreampwd'); // 偏移量：一个常量，前后端协定后一个字符串，前后端一致即可
      
        let srcs = CryptoJS.enc.Utf8.parse(str);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,  // mode 与后台一致。有多个模式可选
          padding: CryptoJS.pad.Pkcs7, //
        });
      
        // 需要返回base64格式的加密结果，使用此句
        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    }
    // var usr = window
    console.log("cookie", Cookies.get('usr'));
    var usr = Cookies.get('usr')
    var pwd = Cookies.get('pwd')
    var verify = Encrypt(`abcdefg&${usr}&${pwd}`) //加密信息
    console.log("verify",verify);
	// 创建播放器实例
    function create(container) {
        const params = {
            container,
            videoBuffer: 0.2, // 缓存时长
            videoBufferDelay: 0.1, // 1000s
            isResize: false,
            text: "",
            loadingText: "Loading",
            debug: true,
            debugLevel: "debug",
            useMSE: true,
            useSIMD: false,
            useWCS: false,
            showBandwidth: false, // 显示网速
            showPerformance: false, // 显示性能
            operateBtns: {
                fullscreen: showOperateBtns,
                screenshot: showOperateBtns,
                play: showOperateBtns,
                audio: showOperateBtns,
                ptz: false,
                quality: showOperateBtns,
                performance: false,
            },
            timeout: 10000,
            heartTimeoutReplayUseLastFrameShow: true,
            audioEngine: "worklet",
            // qualityConfig: ['普清', '高清', '超清', '4K', '8K'],
            forceNoOffscreen: forceNoOffscreen,
            isNotMute: false,
            
            heartTimeout: 10,
            ptzZoomShow:true,
            useCanvasRender: false,
            useWebGPU: true,
            controlHtml: '',
            supportHls265: true,
            // audioEngine:"worklet",
            // isFlv: true
        }
        jessibuca = new JessibucaPro(params);
        jessibuca.on('streamQualityChange', (value) => {
            console.log('streamQualityChange', value);
        })
        // jessibuca.on("start", function (flag) {
        //     setTimeout(function () {
        //         let video = document.getElementById('container').firstChild
        //         Live_canvas.width = Live_canvasTemp.width = video.offsetWidth
        //         Live_canvas.height = Live_canvasTemp.height = video.offsetHeight
        //         console.log( 'startWidthHeight', video.offsetWidth,video.offsetHeight);
        //     }, 2000)
        // })
        jessibuca.on("fullscreen", function (flag) {
                clearPaintPolygon()
                if(flag){
                    timer = setTimeout(()=>{
                        var w = document.documentElement.offsetWidth || document.body.offsetWidth ;
                        var h = document.documentElement.offsetHeight || document.body.offsetHeight ;
                        Live_canvas.width = Live_canvasTemp.width = w
                        Live_canvas.height = Live_canvasTemp.height = h -38
                        drawLineAndPolygon()
                     },1000)

                }else{
                    clearTimeout(timer)
                    Live_canvas.width = Live_canvasTemp.width = 960
                    Live_canvas.height = Live_canvasTemp.height = 559
                    drawLineAndPolygon()
                }
        })
		return jessibuca
    }
    //播放直播
    function Liveplay() {
        jessibucaLive = create($container);
        jessibucaLive.on("playFailedAndPaused", function (error) { 
            jessibucaLive.destroy().then(() => {
                setTimeout(() => {
                    Liveplay()
                },1000)
            })
        })
        if(streamType===0){
            var href = `http://${window.location.hostname}:80/flv/live_ch0_0.flv?verify=${verify}`
            if (href) {
                jessibucaLive.play(href);
            }
        }else{
            var href = `http://${window.location.hostname}:80/flv/live_ch0_1.flv?verify=${verify}`
            if (href) {
                jessibucaLive.play(href);
            }
        }
    }
    Liveplay()
    drawLineAndPolygon()
    // 码流切换操作
    function streamLiveChange(type) {
        streamType = Number(!streamType)
		jessibucaLive.destroy().then(() => {
            Liveplay()
        });
	}
	function imgSettingPlayVideo(){
		if(jessibucaimghadleVideo){
			jessibucaimghadleVideo.destroy()
		}
			jessibucaImgSetting = create($imgSettingVideo)
			var href = `http://${window.location.hostname}:80/flv/live_ch0_1.flv?verify=${verify}`
			if (href) {
				jessibucaImgSetting.play(href);
			}
	}
	function imghandlePlayVideo(){
		if(jessibucaImgSetting){
			jessibucaImgSetting.destroy()
		}
			jessibucaimghadleVideo = create($imghadleVideo)
			var href = `http://${window.location.hostname}:80/flv/live_ch0_1.flv?verify=${verify}`
			if (href) {
				jessibucaimghadleVideo.play(href);
			}
			
    }
// 预览与设置切换操作
function menuChange(menu) {
    if(currentMenu === menu ) return
    if (menu === 1) {
        jessibucaLive.destroy()
    } else {
        // 跳到预览时停止图像设置或者图像处理的视频播放
		if (jessibucaImgSetting || jessibucaimghadleVideo) {
			if (jessibucaImgSetting) {
				jessibucaImgSetting.destroy()
			}
			if (jessibucaimghadleVideo) {
				jessibucaimghadleVideo.destroy()
			}
		}
        Liveplay()
        drawLineAndPolygon()
    }
    currentMenu = menu
}
// 当不在图像设置和图像处理的时候要关掉这两个的预览
function closeimgSettingOrimghandle() {
    let menuList = document.getElementsByClassName("mainMenu")
    for (let i = 0; i < menuList.length; i++){
        if (i != 1 && i != 2) {
            menuList[i].onclick = function () {
                console.log(jessibucaImgSetting,jessibucaimghadleVideo);
                if (jessibucaImgSetting || jessibucaimghadleVideo) {
                    if (jessibucaImgSetting) {
                        jessibucaImgSetting.destroy()
                    }
                    if (jessibucaimghadleVideo) {
                        jessibucaimghadleVideo.destroy()
                    }
                }
            }
        }
    }
}
closeimgSettingOrimghandle()
async function drawLineAndPolygon(){
    let { Line , LineDirection, LineEnable  } =  await getLine()
    let { Polygon, ReeDirection, PolygonEnable,PolygonAction  } = await getPolygon()
    InitLineCanvas('Live_canvas')
    InitPolygonCanvas('Live_canvas','Live_canvasTemp',ReeDirection,PolygonAction)
    lineClearCanvas()
    clearPaintPolygon()
    PolygonEnable && handleForeignData(Polygon)
    LineEnable && drawLine(LineDirection,Line)
}
function getLine(){
    let usr = getCookie('usr')
    let pwd = getCookie('pwd')
    var auth = "Basic " + base64.encode(usr+':'+pwd);
    return new Promise((resolve,reject)=>{  
        $.ajax({
            type:"GET",
            url: "/NetSdk/V2/AI/LineCrossDetect",
            dataType:"json",
            beforeSend : function(req){ 
                req.setRequestHeader('Authorization', auth);
            },
            success:function(data){
                resolve({ Line:data.DetectLine,LineDirection:data.Direction,LineEnable:data.Enabled })
            }   
        });  
    })
}
function getPolygon(){
    let usr = getCookie('usr')
    let pwd = getCookie('pwd')
    var auth = "Basic " + base64.encode(usr+':'+pwd);
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"GET",
            url: "/NetSdk/V2/AI/RegionDetect",
            dataType:"json",
            beforeSend : function(req){ 
                req.setRequestHeader('Authorization', auth);
            },
            success:function(data){
                resolve({ Polygon:data.DetectRegion,ReeDirection:data.Direction,PolygonEnable:data.Enabled,PolygonAction:data.Action })
            }   
        });  
    })
}
function getCookie(name){
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for ( var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name){
            return decodeURIComponent(arr[1])
        }
    }
    return "";
  }
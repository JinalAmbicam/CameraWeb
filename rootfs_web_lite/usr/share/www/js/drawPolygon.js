let Ia_canvas
let Ia_canvasTemp
let canvasObj 
let canvasTempObj 
let Ia_canvasWidth 
let Ia_canvasHeight
let canvasBoxId
let pointList = []
let maxPointNum = 4
let minPointNum = 3
let closeStatus = false
let PolgonDirection
let PolgonAction
function InitPolygonCanvas(idName,idTempName,Direction,Action,canvasBoxIdName){
    canvasBoxId = canvasBoxIdName
    Ia_canvas = document.getElementById(idName)
    Ia_canvasTemp = document.getElementById(idTempName)
    canvasObj = Ia_canvas.getContext("2d")
    canvasTempObj  = Ia_canvasTemp.getContext("2d")
    Ia_canvasWidth = Ia_canvas.width
    Ia_canvasHeight = Ia_canvas.height
    canvasObj.lineWidth = 2
    canvasObj.strokeStyle = "yellow"
    canvasObj.fillStyle = "rgba(255,255,0, 0.3)"
    canvasTempObj.lineWidth = 2
    canvasTempObj.strokeStyle = "yellow";
    PolgonAction = Action
    PolgonDirection = Direction
    displayAreaDetHtml()
}
function draw(e) {
    // 鼠标右键时
    if(e.button === 2){
        if(pointList.length >= 3 ){
            closeFigure();
            return
        }
    }
    // 点一个当前点
    let pointDown = {
        x: e.offsetX,
        y: e.offsetY,
    };
    // 如果当前有图形闭合,则不能继续画
    if(closeStatus){
        return
    }
    // 第一个点
    if(!closeStatus){}
    if (pointList.length === 0 ) {
        clearPaintPolygon();
        canvasObj.moveTo(pointDown.x, pointDown.y);
        // 设置鼠标事件
        setMousefun()
        // 隐藏提示
        hiddenWarning()
    } else {
        // 首先检查生成的点是否符合要求
        const check = checkPointClose(pointDown, pointList);
        switch (check) {
        case "closeFirst":
            closeFigure();
            return;
        case false:
            return;
        case true:
            break;
        }
        if(!checkPointCross(pointDown,pointList)){
            return
        }
        // 已经有点了，连成线
        canvasObj.lineTo(pointDown.x, pointDown.y);
        canvasObj.stroke();
    }
        pointList.push({
            ...pointDown,
        });
    // 如果已经到达最大数量，则直接闭合图形
        if (pointList.length >= maxPointNum) {
            closeFigure();
            return;
        }
}
// 让线跟随鼠标移动
function setMousefun(){
    if(canvasBoxId){
        document.getElementById( canvasBoxId ).onmouseup = () => {
            document.getElementById( canvasBoxId ).onmousemove = (event) => {
                let point = pointList[pointList.length - 1]
                canvasTempObj.clearRect(
                    0,
                    0,
                    Ia_canvasWidth,
                    Ia_canvasHeight
                );
                canvasTempObj.beginPath();
                canvasTempObj.moveTo(point.x, point.y);
                canvasTempObj.lineTo(event.offsetX, event.offsetY);
                canvasTempObj.stroke();
            };
        };
    }
}
    
// 闭合图形
function closeFigure() {
    // 检查部分
    if (!checkPointCross(pointList[0], pointList)) {
        console.log("闭合图形时发生横穿线，请重新绘制！");
        showWarning()
        clearPaintPolygon();
        return;
    }
    if (pointList.length >= minPointNum && !closeStatus) {
        // 符合要求
        canvasTempObj.lineTo(pointList[0].x, pointList[0].y);
        canvasObj.closePath();
        canvasObj.stroke();
        // canvasObj.fill();
        if(canvasBoxId){
            document.getElementById( canvasBoxId ).onmousemove = document.getElementById( canvasBoxId ).onmouseup = null;
        }
        canvasTempObj.clearRect(0, 0, Ia_canvasWidth, Ia_canvasHeight);
        closeStatus = true;
        // 绘制结束
        PolgonAction === 'EnterOrExit' && drawArrow(pointList[0],pointList[1])
    }
}

// 清除图形
function clearPaintPolygon() {
    pointList = [];
    if(canvasBoxId){
        document.getElementById( canvasBoxId ).onmousemove = document.getElementById( canvasBoxId ).onmouseup = null;
    }
    canvasTempObj.clearRect(0, 0, Ia_canvasWidth, Ia_canvasHeight);
    canvasTempObj.beginPath()
    canvasObj.clearRect(0, 0, Ia_canvasWidth, Ia_canvasHeight);
    canvasObj.beginPath();
    closeStatus = false;
}
// 检查点有没有与当前点位置太近，如果太近就不认为是一个点
function checkPointClose(point, pointList) {
    let i;
    for (i = 0; i < pointList.length; ++i) {
        const distance = Math.sqrt(
        Math.abs(pointList[i].x - point.x) +
            Math.abs(pointList[i].y - point.y)
        );
        if (distance > 3) {
            continue;
        }
        // 如果是在第一个点附近点的，那就认为是在尝试闭合图形
        if (pointList.length >= minPointNum && i === 0) {
            return "closeFirst";
        }
        return false;
    }
    return true;
}

// 辅助函数 获取以point1作为原点的线
function getPointLine(point1, point2) {
    const p1 = {
        x: point2.x - point1.x,
        y: point2.y - point1.y,
    };
    return p1;
} 
// 辅助函数 两线叉乘 两线的起点必须一致
function crossLine(point1, point2) {
    return point1.x * point2.y - point2.x * point1.y;
}

// 辅助函数 检查第二条线的方向在第一条线的左还是右
function isDirection(point1, point2, point3) {
// 假设point1是原点
    const p1 = getPointLine(point1, point2);
    const p2 = getPointLine(point1, point3);
    return crossLine(p1, p2);
}

// 辅助函数 判断两个点是否是同一个
function isEuqalPoint(point1, point2) {
    if (point1.x == point2.x && point1.y == point2.y) {
        return true;
    }
}

// 辅助函数 检查两个线是否交叉
function isPointCross(line1P1, line1P2, line2P1, line2P2) {
const euqal =
    isEuqalPoint(line1P1, line2P1) ||
    isEuqalPoint(line1P1, line2P2) ||
    isEuqalPoint(line1P2, line2P1) ||
    isEuqalPoint(line1P2, line2P2);
    const re1 = isDirection(line1P1, line1P2, line2P1);
    const re2 = isDirection(line1P1, line1P2, line2P2);
    const re3 = isDirection(line2P1, line2P2, line1P1);
    const re4 = isDirection(line2P1, line2P2, line1P2);
    const re11 = re1 * re2;
    const re22 = re3 * re4;
    if (re11 < 0 && re22 < 0) return true;
    if (euqal) {
        if (re1 === 0 && re2 === 0 && re3 === 0 && re4 === 0) return true;
    } else {
        if (re11 * re22 === 0) return true;
    }
    return false;
}

// 检查图形有没有横穿
function checkPointCross(point, pointList) {
    let i;
    if (pointList.length < 3) {
        return true;
    }
    for (i = 0; i < pointList.length - 2; ++i) {
        const re = isPointCross(
        pointList[i],
        pointList[i + 1],
        pointList[pointList.length - 1],
        point
        );
        if (re) {
        return false;
        }
    }
    return true;
}

// 区域的边界相交,显示提示
function showWarning(){
    document.getElementById('warning').style.display = 'block'
}
// 隐藏提示
function hiddenWarning(){
    document.getElementById('warning').style.display = 'none'
}
// 阻止默认的右键菜单弹出
document.getElementById('canvasBox').oncontextmenu = function(){
    return false
}
document.getElementById('ReecanvasBox').oncontextmenu = function(){
    return false
}
// 处理外来的数据
function handleForeignData(canvasData) {
    // 如果坐标都为0就不画
    let DetectRegionTotal = 0
    canvasData.map((item)=>{
        DetectRegionTotal = DetectRegionTotal + item[0] + item[1]
    })
    if(DetectRegionTotal === 0 ){
        return
    }
    let polygonData = []
    canvasData.map((item)=>{
        let polygonItem = {}
        polygonItem.x = Math.round( (item[0]/10000)*Ia_canvasWidth  )
        polygonItem.y = Math.round( (item[1]/10000)*Ia_canvasHeight )
        polygonData.push(polygonItem)
    })
    clearPaintPolygon();
    if (
        !polygonData ||
        polygonData.length < minPointNum ||
        polygonData.length > maxPointNum
    ) {
        console.log("回显数据不符合要求！");
        return;
    }
    pointList = polygonData;
    echoFigure();
}
// 回显图形
function echoFigure() {
    canvasObj.beginPath();
    canvasObj.moveTo(pointList[0].x, pointList[0].y);
    for (let i = 1; i < pointList.length; ++i) {
        canvasObj.lineTo(pointList[i].x, pointList[i].y);
    }
    // canvasObj.closePath();
    canvasObj.stroke();
    // 如果是在首页直接闭合图形，在设置页得判断是否符合条件
    closeFigure();
}
//根据第一点和第二点的坐标画箭头
function drawArrow(startPoint,secondPoint){
    // 获得第一点第二点直线的向量坐标
    let lineVector = { 
        x:secondPoint.x - startPoint.x,
        y: secondPoint.y- startPoint.y
    }
    // 获取中点的坐标
    let midPoint = {
        x: ( startPoint.x + secondPoint.x ) /2,
        y: ( startPoint.y +  secondPoint.y ) /2
    }
    let pointA = {
        x:0,
        y:0
    }
    let pointB = {
        x:0,
        y:0
    } 
    let pointA1 = {
        x:0,
        y:0
    }
    let pointB1 = {
        x:0,
        y:0
    }
    if(lineVector.x === 0){
        pointA.y = pointA1.y = pointB.y = pointB1.y = midPoint.y
        pointA.x = midPoint.x + 4
        pointA1.x = midPoint.x + 20
        pointB.x = midPoint.x - 4
        pointB1.x = midPoint.x - 20
    }else{
        let Yb = Math.sqrt( 10  /( Math.pow( lineVector.y/lineVector.x, 2 ) + 1 ) )
        let Yblong = Math.sqrt( 400  /( Math.pow( lineVector.y/lineVector.x, 2 ) + 1 ) )
        pointA.y = Yb + midPoint.y
        pointA1.y = Yblong + midPoint.y
        pointB.y = -Yb + midPoint.y
        pointB1.y = -Yblong + midPoint.y
        pointA.x = -(lineVector.y/lineVector.x)*(  pointA.y - midPoint.y ) + midPoint.x
        pointA1.x = -(lineVector.y/lineVector.x)*(  pointA1.y - midPoint.y ) + midPoint.x
        pointB.x = -(lineVector.y/lineVector.x)*(  pointB.y - midPoint.y ) + midPoint.x
        pointB1.x = -(lineVector.y/lineVector.x)*(  pointB1.y - midPoint.y ) + midPoint.x
    }
    if(PolgonDirection === 'Enter'){
        // 只检测进入
        if(isPointInPolygon(pointList,pointA)){
            // A在里面
            drawArrowLine(canvasObj,pointB1.x,pointB1.y,pointA1.x,pointA1.y,30,15,2,'yellow')
        }else{
            // B在里面
            drawArrowLine(canvasObj,pointA1.x,pointA1.y,pointB1.x,pointB1.y,30,15,2,'yellow')
        }
    }else{
        // 检测离开
        if(isPointInPolygon(pointList,pointA)){
            // A在里面
            drawArrowLine(canvasObj,pointA1.x,pointA1.y,pointB1.x,pointB1.y,30,15,2,'yellow')
        }else{
            // B在里面
            drawArrowLine(canvasObj,pointB1.x,pointB1.y,pointA1.x,pointA1.y,30,15,2,'yellow')
        }
    }
}
// 判断点是不是在多边形内
function isPointInPolygon(Polygon, Point) {
        var CrossNum = 0
        for (let i = 0; i < Polygon.length; i++) {
            var p1 = Polygon[i], p2 = Polygon[(i + 1) % Polygon.length]
            if (p1.y == p2.y || Point.y < Math.min(p1.y, p2.y) || Point.y >= Math.max(p1.y, p2.y)){
                continue
            }
            var x = (Point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x
            if (x > Point.x){
                CrossNum++
            }else{
            }   
        }
        return CrossNum % 2 == 1
}
function checkinPolygon(){
        let testPoint = {
            x: parseInt( document.getElementById('pointX').value ),
            y:parseInt( document.getElementById('pointY').value )
        }
        // 绘制结束
        canvasObj.fillStyle = 'red'
        canvasObj.font = "16px serif";
        canvasObj.fillText('test', testPoint.x, testPoint.y)
        console.log('pointInPolygon',isPointInPolygon(pointList,testPoint));
}

// 画箭头
function drawArrowLine(ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {
        theta = typeof(theta) != 'undefined' ? theta : 30;
        headlen = typeof(theta) != 'undefined' ? headlen : 10;
        width = typeof(width) != 'undefined' ? width : 1;
        color = typeof(color) != 'color' ? color : '#000';

        // 计算各角度和对应的P2,P3坐标
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);

        ctx.save();
        ctx.beginPath();

        var arrowX = fromX - topX,
        arrowY = fromY - topY;
        
        if(PolgonDirection === 'EnterOrExit'){
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(fromX, fromY);
            arrowX = fromX - botX;
            arrowY = fromY - botY;
            ctx.lineTo(arrowX, arrowY);
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);

            // Reverse length on the other side
            arrowX = toX + topX;
            arrowY = toY + topY;
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(toX, toY);
            arrowX = toX + botX;
            arrowY = toY + botY;
            ctx.lineTo(arrowX, arrowY);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
            ctx.restore();
        }else{
            ctx.moveTo(arrowX, arrowY);
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            arrowX = toX + topX;
            arrowY = toY + topY;
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(toX, toY);
            arrowX = toX + botX;
            arrowY = toY + botY;
            ctx.lineTo(arrowX, arrowY);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
            ctx.restore();
        }
}
 
// 方向改变
function directionChange(e){
    PolgonDirection = e.target.value
    canvasTempObj.clearRect(0, 0, Ia_canvasWidth, Ia_canvasHeight);
    canvasTempObj.beginPath()
    canvasObj.clearRect(0, 0, Ia_canvasWidth, Ia_canvasHeight);
    canvasObj.beginPath();
    closeStatus = false;
    echoFigure()
    PolgonAction === 'EnterOrExit' && pointList.length!=0 && drawArrow(pointList[0],pointList[1])
}
//action改变
function ActionChange(e){
    PolgonAction = e.target.value
    displayAreaDetHtml()
    canvasTempObj.clearRect(0, 0, Ia_canvasWidth, Ia_canvasHeight);
    canvasTempObj.beginPath()
    canvasObj.clearRect(0, 0, Ia_canvasWidth, Ia_canvasHeight);
    canvasObj.beginPath();
    closeStatus = false;
    echoFigure()
    PolgonAction === 'EnterOrExit' &&  pointList.length!=0 && drawArrow(pointList[0],pointList[1])
}

// 区域检测根据action来显示对应功能
function displayAreaDetHtml(){
    if(PolgonAction === 'Inside'){
        $('.tr_Ia_Direation').css('display','none')
        $('.tr_Intrusion_Analysis').css('display','')
        $('.tr_Intrusion_Analysis_white').css('background-color','#fff')
        $('.tr_Intrusion_Analysis_gray').css('background-color','rgb(241, 241, 241)')
    }else{
        $('.tr_Ia_Direation').css('display','')
        $('.tr_Intrusion_Analysis').css('display','none')
    }
}
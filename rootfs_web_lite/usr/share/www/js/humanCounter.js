function HumanCounterCanvas(canvasId,startPoint,endPoint,direction) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.direction = direction
    this.beforeStartPoint = startPoint //旋转时要根据一开始的起始点和终点进行旋转
    this.beforeEndPoint = endPoint
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.centerPoint = {
        x:640,
        y:360
    }
    // 画线和判断A、B区域
    this.drawLine = function(startPoint,endPoint){
        // 将起点、终点坐标换算成在canvas中实际的坐标
        let startPositionX = startPoint.x 
        let startPositionY = startPoint.y
        let endPositionX = endPoint.x
        let endPositionY = endPoint.y   
        // 画直线
        this.context.beginPath();
        this.context.moveTo(startPositionX,startPositionY);
        this.context.lineTo(endPositionX,endPositionY);
        this.context.lineWidth = 3;
        this.context.strokeStyle = "yellow";
        this.context.stroke();
        // 获得直线的向量坐标
        let lineVector = { 
            x:endPositionX - startPositionX,
            y:endPositionY - startPositionY
        } 
        // 获取中点的坐标
        let midPoint = {
            x: ( startPositionX + endPositionX ) /2,
            y: ( startPositionY +  endPositionY ) /2
        }
        //AB向量
        let verticalVector = {
            x: lineVector.y === 0 ? 0 : -lineVector.y,
            y: lineVector.x
        }
        // 获取A、B点的x、y坐标
        let pointA = {
            x:0,
            y:0
        }
        let pointB = {
            x:0,
            y:0
        }
        let pointC ={
            x:0,
            y:0
        }
        let pointD = {
            x:0,
            y:0
        }
        //如果垂直向量为水平方向
        if(verticalVector.y === 0){
            if(verticalVector.x > 0){
                pointB.x =  midPoint.x + 20
                pointC.x = midPoint.x + 20
                pointA.x = midPoint.x - 20
                pointD.x = midPoint.x - 20
            }else{
                pointB.x =  midPoint.x - 20
                pointC.x = midPoint.x - 20
                pointA.x = midPoint.x + 20
                pointD.x = midPoint.x + 20
            }
            pointB.y = pointC.y = pointA.y = pointD.y = midPoint.y
        }else{
            let Yb = Math.sqrt( 3600 /( Math.pow( verticalVector.x/verticalVector.y,2 ) + 1 ) ) 
            let Yc = Math.sqrt( 2500 /( Math.pow( verticalVector.x/verticalVector.y,2 ) + 1 ) ) 
            if(verticalVector.y > 0 ){
                pointB.y = Yb + midPoint.y
                pointC.y = Yc + midPoint.y
                pointA.y = -Yb + midPoint.y
                pointD.y =  -Yc + midPoint.y
            }else{
                pointB.y = -Yb + midPoint.y
                pointC.y = -Yc + midPoint.y
                pointA.y = Yb + midPoint.y
                pointD.y =  Yc + midPoint.y
            }
            pointB.x =  ( verticalVector.x/verticalVector.y )*( pointB.y - midPoint.y ) + midPoint.x
            pointA.x =  ( verticalVector.x/verticalVector.y )*( pointA.y - midPoint.y ) + midPoint.x
            pointC.x =  ( verticalVector.x/verticalVector.y )*( pointC.y - midPoint.y ) + midPoint.x
            pointD.x =  ( verticalVector.x/verticalVector.y )*( pointD.y - midPoint.y ) + midPoint.x
        }
        // 画A、B箭头
        this.context.fillStyle = 'yellow'
        this.context.font = "16px serif";
        this.context.fillText('B', pointB.x, pointB.y + 30)
        this.context.fillText('A', pointA.x, pointA.y + 30)
        drawArrowLine(this.context,pointA.x,pointA.y,pointB.x,pointB.y,30,15,3,'yellow',this.direction)
    }
    // 直线旋转
    this.rotateLine= function(degress){ 
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        let { sinDegress,cosDegress } = getSinAndCosVal(Number(degress)) 
        this.startPoint = { 
            x: ( this.beforeStartPoint.x -  this.centerPoint.x )*cosDegress - ( this.beforeStartPoint.y -  this.centerPoint.y)*sinDegress+ this.centerPoint.x,
            y: (  this.beforeStartPoint.x -  this.centerPoint.x )*sinDegress + ( this.beforeStartPoint.y -  this.centerPoint.y)*cosDegress+ this.centerPoint.y
        }
        this.endPoint = { 
            x: (  this.beforeEndPoint.x -  this.centerPoint.x )*cosDegress - ( this.beforeEndPoint.y -  this.centerPoint.y)*sinDegress + this.centerPoint.x,
            y: (  this.beforeEndPoint.x -  this.centerPoint.x )*sinDegress + ( this.beforeEndPoint.y -  this.centerPoint.y)*cosDegress+ this.centerPoint.y
        }
        // let newDetectLine = [ [ (newStartPoint.x / canvasWidth)*10000 ,(newStartPoint.y /canvasHeight)*10000 ],[ (newEndPoint.x / canvasWidth)*10000 ,(newEndPoint.y /canvasHeight)*10000 ]]
        if(isOutOfBounds(this.startPoint,this.endPoint)){
            // 如果出界了,重新计算直线与边界的交点
            let IntersectionPoint = lineIntersectionPoint(this.startPoint,this.endPoint)
            this.startPoint = IntersectionPoint.newStartPoint
            this.endPoint = IntersectionPoint.newEndPoint
        }
        this.drawLine(this.startPoint,  this.endPoint)
    }
    // 直线伸长
    this.enLarge =  function(){
        let centerToStartVector = {
            x:this.startPoint.x - this.centerPoint.x,
            y:this.startPoint.y - this.centerPoint.y
        }
        let centerToEndVector = {
            x:this.endPoint.x - this.centerPoint.x,
            y:this.endPoint.y - this.centerPoint.y
        }
        this.startPoint = this.beforeStartPoint = {
            x: 1.2 *centerToStartVector.x + this.centerPoint.x ,
            y:1.2*centerToStartVector.y + this.centerPoint.y
        }
        this.endPoint = this.beforeEndPoint = {
            x: 1.2 *centerToEndVector.x + this.centerPoint.x ,
            y:1.2*centerToEndVector.y + this.centerPoint.y
        }
        // 判断伸长后是否超出边界,如果超出就计算直线与边界的交点
        if(isOutOfBounds(this.beforeStartPoint,this.beforeEndPoint)){
            // 如果出界了,重新计算直线与边界的交点
            let IntersectionPoint = lineIntersectionPoint(this.beforeStartPoint,this.beforeEndPoint)
            this.startPoint = this.beforeStartPoint = IntersectionPoint.newStartPoint
            this.endPoint = this.beforeEndPoint = IntersectionPoint.newEndPoint
        }
        console.log(this.beforeStartPoint,this.beforeEndPoint);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawLine(this.beforeStartPoint, this.beforeEndPoint)
    }
    // 直线缩短
    this.reDuce = function(){
        let centerToStartVector = {
            x:this.startPoint.x - this.centerPoint.x,
            y:this.startPoint.y - this.centerPoint.y
        }
        let centerToEndVector = {
            x:this.endPoint.x - this.centerPoint.x,
            y:this.endPoint.y - this.centerPoint.y
        }
        let currentLineLong = getCurrentLineLong(this.beforeStartPoint,this.beforeEndPoint)  //当前直线的长度
        if(currentLineLong < 200){
            return
        }
        this.startPoint =  this.beforeStartPoint = {
            x: 0.8 *centerToStartVector.x + this.centerPoint.x ,
            y:0.8*centerToStartVector.y + this.centerPoint.y
        }
        this.endPoint =  this.beforeEndPoint = {
            x: 0.8 *centerToEndVector.x + this.centerPoint.x ,
            y:0.8*centerToEndVector.y + this.centerPoint.y
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawLine(this.beforeStartPoint,this.beforeEndPoint)
    }
    // 改变角度
    this.directionChange = function(direction){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.direction = direction
        this.drawLine(this.startPoint,this.endPoint)  
    }
    this.drawLine(this.beforeStartPoint,this.beforeEndPoint)  
    // 计算两点之间的距离
    function getCurrentLineLong(startPoint,endPoint){
        return Math.sqrt( Math.pow( startPoint.x - endPoint.x ,2) + Math.pow( startPoint.y - endPoint.y ,2) )
    }
    // 计算角度的sin与cos值
    function getSinAndCosVal(degress){
        let sinDegress , cosDegress
        switch(degress){
            case 90:
                cosDegress = 0
                sinDegress = 1
                break;
            case 180:
                cosDegress = -1
                sinDegress = 0
                break;
            case 270:
                cosDegress = 0
                sinDegress = -1
                break;
            case 360:
                cosDegress = 1
                sinDegress = 0;
                break;
            default:
                cosDegress = Math.cos(Math.PI/180*degress)
                sinDegress = Math.sin(Math.PI/180*degress)
        }
        return {
            sinDegress,cosDegress
        }
    }
    // 1.判断线是否超出，只需判断点的坐标有没有一个为负就行
    function isOutOfBounds(startPoint,endPoint){
        if(startPoint.x < 0 || startPoint.y <0 || endPoint.x<0 || endPoint.y <0 ){
            return true
        }else{
            return false
        }
    }
    // 2.如果超出了, 需计算直线与边界的交点
    function lineIntersectionPoint(startPoint,endPoint){
        let diagonalSlope = 360/640 //对角线斜率
        let newStartPoint ={
            x:0,
            y:0
        }
        let newEndPoint ={
            x:0,
            y:0
        }
        //如果与坐标轴垂直
        // 与x轴平行
        if(startPoint.y === endPoint.y){
            if(startPoint.x <0){
                newStartPoint ={ x:0 , y:360 }
                newEndPoint = { x:1280 , y:360 }
            }
            if(endPoint.x <0){
                newStartPoint = { x:1280 , y:360 }
                newEndPoint ={ x:0 , y:360 }
            }
            return {
                newStartPoint,newEndPoint
            }
        }
        // 与y轴平行
        if(startPoint.x === endPoint.x){
            if(startPoint.y <0){
                newStartPoint ={ x:640 , y:0 }
                newEndPoint = { x:640 , y:720 }
            }
            if(endPoint.y <0){
                newStartPoint = { x:640 , y:720 }
                newEndPoint ={ x:640 , y:0 }
            }
            return {
                newStartPoint,newEndPoint
            }
        }
        let k = ( endPoint.y - startPoint.y )/( endPoint.x - startPoint.x  )
        // 根据直线的斜率判断直线与横轴or纵轴相交,然后用直线两点式求直线与边界的坐标
        if(Math.abs(k) < diagonalSlope ){
            // 与纵轴相交
            //  与x = 0的交点
            let leftPoint = {
                x:0,
                y: (-endPoint.x)*(startPoint.y - endPoint.y)/(startPoint.x - endPoint.x) + endPoint.y
            }
            // 与x = 1280的交点
            let rightPoint = {
                x:1280,
                y:(1280 - endPoint.x)*(startPoint.y - endPoint.y)/(startPoint.x - endPoint.x) + endPoint.y
            }
            // 判断哪个是起点，哪个是终点
            if( endPoint.x - startPoint.x > 0 ){
                newStartPoint = leftPoint
                newEndPoint = rightPoint
            }else{
                newStartPoint = rightPoint
                newEndPoint = leftPoint
            }
        }
        if(Math.abs(k) > diagonalSlope){
            // 与横轴相交
            // 与y = 0 的交点
            let topPoint = {
                x : (-endPoint.y)*(startPoint.x - endPoint.x)/(startPoint.y - endPoint.y) + endPoint.x,
                y:0
            }
            // 与y=720的交点
            let bottomPoint = {
                x:x = (720 - endPoint.y)*(startPoint.x - endPoint.x)/(startPoint.y - endPoint.y) + endPoint.x,
                y:720
            }
            // 判断哪个是起点，哪个是终点
            if( endPoint.y - startPoint.y > 0 ){
                newStartPoint = topPoint
                newEndPoint = bottomPoint
            }else{
                newStartPoint = bottomPoint
                newEndPoint = topPoint
            }
            
        }
        return {
            newStartPoint,newEndPoint
        }
    }
    // 画箭头
    // ctx：Canvas绘图环境
    // fromX, fromY：起点坐标（也可以换成p1，只不过它是一个数组）
    // toX, toY：终点坐标 (也可以换成p2，只不过它是一个数组)
    // theta：三角斜边一直线夹角
    // headlen：三角斜边长度
    // width：箭头线宽度
    // color：箭头颜色
    // direction：箭头方向
    function drawArrowLine(ctx, fromX, fromY, toX, toY,theta,headlen,width,color,direction) {            
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
            
            if(direction === 'Both'){
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
            }else if(direction === 'A->B'){
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
            }else if(direction === 'B->A'){
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(fromX, fromY);
                arrowX = fromX - botX;
                arrowY = fromY - botY;
                ctx.lineTo(arrowX, arrowY);
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
                ctx.restore();
            }
            
    }
}

let humaCounterCanvasObj
// 初始化
function initHumaCounterCanvas(DetectLine,direction){
    let canvasWidth = 1280
    let canvasHeight = 720
    let startPoint = {
        x: ( DetectLine[0][0]/10000 )*canvasWidth,
        y: ( DetectLine[0][1]/10000 )*canvasHeight
    }
    let endPoint = {
        x:( DetectLine[1][0]/10000 )*canvasWidth,
        y:( DetectLine[1][1]/10000 )*canvasHeight
    }
    document.getElementById('manualInput').value = 0
    document.getElementById('slider_input').value = 0
    humaCounterCanvasObj = new HumanCounterCanvas('HumanCounter_img',startPoint,endPoint,direction)
}
// 获取起点和终点
function getHumanCounterPoint(){
    let canvasWidth = 1280
    let canvasHeight = 720
    let { startPoint,endPoint} =  humaCounterCanvasObj
    let detectLine = [ [ (startPoint.x / canvasWidth)*10000 ,(startPoint.y /canvasHeight)*10000 ],[ (endPoint.x / canvasWidth)*10000 ,(endPoint.y /canvasHeight)*10000 ]]
    return detectLine
}
// 获取方向
function getHumanCounterDirection(){
    return humaCounterCanvasObj.direction
}
// 手动输入角度改变
function manualInputChange(value){
    if(!value){
        document.getElementById('manualInput').value = 0
        document.getElementById('slider_input').value = 0
    }else{
        document.getElementById('slider_input').value = value
    }
    humaCounterCanvasObj.rotateLine(value)
}
// 滑块输入角度改变
function sliderInputChange(value){
    document.getElementById('manualInput').value = value
    humaCounterCanvasObj.rotateLine(value)
}
function enLarge(){
    document.getElementById('manualInput').value = 0
    document.getElementById('slider_input').value = 0
    humaCounterCanvasObj.enLarge()
}
function reDuce(){
    document.getElementById('manualInput').value = 0
    document.getElementById('slider_input').value = 0
    humaCounterCanvasObj.reDuce()
}

function humanCounterDirectionChange(direction){
    humaCounterCanvasObj.directionChange(direction)
}
function clearhumaCounterCanvas(){
    let canvas = document.getElementById('HumanCounter_img');
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height)
}
function ViewCustomerTrafficStatisticsData(){
    $('#Customer_traffic_statistics_table').css('display','none')
    $('#Customer_traffic_statistics_echart').css('display','block')
    Customer_traffic_statistics_search()
}
function goBackSettings(){
    $('#Customer_traffic_statistics_table').css('display','block')
    $('#Customer_traffic_statistics_echart').css('display','none')
    document.getElementById('humanCounterMonthly').className = 'tab_change current'
    document.getElementById('humanCounterDaily').className = 'tab_change'
}
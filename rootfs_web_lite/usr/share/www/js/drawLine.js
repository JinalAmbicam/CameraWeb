// 画拌线
let canvas 
let context 
let canvasWidth 
let canvasHeight
let startPoint = { x : 0 , y : 0  }
let endPoint = { x : 0 , y : 0 }
let drawPointNum = 2
let Direction = document.getElementById('Lcd_Direation').value
let DetectLine = []
function InitLineCanvas(CanvasId){
    canvas = document.getElementById(CanvasId);
    context = canvas.getContext("2d");
    canvasWidth = canvas.width
    canvasHeight = canvas.height
}
// 画线和判断A、B区域
function drawLine(direction,detectLine){
    Direction = direction
    DetectLine = detectLine
    // 如果坐标都为0就不画
    let DetectLineAddTotal = 0
    detectLine.map((item)=>{
        DetectLineAddTotal =  DetectLineAddTotal + item[0] + item[1]
    })
    if(DetectLineAddTotal === 0){
        return
    }
    // 将起点、终点坐标换算成在canvas中实际的坐标
    let startPositionX = ( detectLine[0][0]/10000 )*canvasWidth
    let startPositionY = ( detectLine[0][1]/10000 )*canvasHeight
    let endPositionX = ( detectLine[1][0]/10000 )*canvasWidth
    let endPositionY =  ( detectLine[1][1]/10000 )*canvasHeight
    // 画直线
    context.beginPath();
    context.moveTo(startPositionX,startPositionY);
    context.lineTo(endPositionX,endPositionY);
    context.lineWidth = 2;
    context.strokeStyle = "yellow";
    context.stroke();
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
    //获取直线向量顺时针旋转90°后的向量坐标
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
    context.fillStyle = 'yellow'
    context.font = "16px serif";
    context.fillText('B', pointB.x, pointB.y + 30)
    context.fillText('A', pointA.x, pointA.y + 30)
    context.beginPath();                 
    context.moveTo(pointB.x,pointB.y);
    context.lineTo(pointA.x,pointA.y);
    context.stroke();
    let pointB1 = {
        x:0,
        y:0
    }
    let pointB2 = {
        x:0,
        y:0
    }
    let pointA1 = {
        x:0,
        y:0
    }
    let pointA2 = {
        x:0,
        y:0
    }
    if(lineVector.y === 0){
        if(lineVector.x > 0){
            pointB1.x = pointB.x - 10
            pointB2.x = pointB.x + 10
            pointB1.y = pointB2.y = pointB.y -20
            pointA1.x = pointA.x + 10
            pointA2.x = pointA.x - 10
            pointA1.y =  pointA2.y = pointA.y + 20
        }else{
            pointB1.x = pointB.x - 10
            pointB2.x = pointB.x + 10
            pointB1.y = pointB2.y = pointB.y + 20
            pointA1.x = pointA.x + 10
            pointA2.x = pointA.x - 10
            pointA1.y =  pointA2.y = pointA.y - 20
        }
    }else{
        let Yb1 = Math.sqrt( 64 /( Math.pow( lineVector.x/lineVector.y,2 ) + 1 )) 
        pointB1.y = Yb1 + pointC.y
        pointB2.y = -Yb1 + pointC.y
        pointA1.y = Yb1 + pointD.y
        pointA2.y = -Yb1 + pointD.y
        if(lineVector.x === 0){
            if(lineVector.y > 0){
                pointB1.x =  pointB2.x = pointB.x + 10
                pointA1.x = pointA2.x = pointA.x - 10
            }else{
                pointB1.x =  pointB2.x = pointB.x - 10
                pointA1.x = pointA2.x = pointA.x + 10
            }
        }else{
            pointB1.x =  ( lineVector.x/lineVector.y )*( pointB1.y - pointC.y ) + pointC.x
            pointB2.x =  ( lineVector.x/lineVector.y )*( pointB2.y - pointC.y ) + pointC.x
            pointA1.x =  ( lineVector.x/lineVector.y )*( pointA1.y - pointD.y ) + pointD.x
            pointA2.x =  ( lineVector.x/lineVector.y )*( pointA2.y - pointD.y ) + pointD.x
        }
    }
    if(Direction === 'A->B' || Direction === 'Both'){
        context.beginPath();
        context.moveTo(pointB1.x,pointB1.y);
        context.lineTo(pointB.x,pointB.y);
        context.lineTo(pointB2.x,pointB2.y);
        context.lineWidth = 2;
        context.strokeStyle = "yellow";
        context.stroke();
    }
    if(Direction === 'B->A' || Direction === 'Both'){
        context.beginPath();
        context.moveTo(pointA1.x,pointA1.y);
        context.lineTo(pointA.x,pointA.y);
        context.lineTo(pointA2.x,pointA2.y);
        context.lineWidth = 2;
        context.strokeStyle = "yellow";
        context.stroke();
    }
}
function mouseMove(e){
    if(drawPointNum >=1 && drawPointNum < 2){
        lineClearCanvas()
        context.moveTo(startPoint.x,startPoint.y);
        context.lineTo(e.offsetX,e.offsetY);
        context.lineWidth = 2;
        context.strokeStyle = "yellow";
        context.stroke();
    }
}
function mouseDown(e){
    drawPointNum ++
    if(drawPointNum === 1){
        startPoint = { x: e.offsetX , y : e.offsetY } 
    }
    if(drawPointNum === 2){
        endPoint = { x:e.offsetX , y:e.offsetY }
        let detectLine = [ [ (startPoint.x / canvasWidth)*10000 ,(startPoint.y /canvasHeight)*10000 ],[ (endPoint.x / canvasWidth)*10000 ,(endPoint.y /canvasHeight)*10000 ]]
        drawLine(Direction,detectLine)
    }
}
function clearPaint(){       
    lineClearCanvas()
    drawPointNum = 0
    DetectLine = []
}
function Lcd_DireationChange(e){
    Direction = e.target.value
    lineClearCanvas()
    if(DetectLine.length != 0){
        drawLine(Direction,DetectLine)
    }
}
// 清除画布
function lineClearCanvas(){
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.beginPath();
}
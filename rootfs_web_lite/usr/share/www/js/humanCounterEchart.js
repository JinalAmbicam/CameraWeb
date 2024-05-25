let myChart = echarts.init(document.getElementById('echart_box'))
let option = {
    title: {
        text: langstr.CustomerTrafficStatisticsData,
        left: 'center',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false,
            label:{
                formatter: function (params) {
                    return ''
                }
            }
        },
    },
    yAxis: {
        name: 'Unit: ( person ) ',  
        type: 'value',
        axisLine: {
            //y轴线的颜色以及宽度
            show: true
        },
    },
    grid: {
        bottom: '75px',
    },
    series: [
        {
            name: 'Customer Traffic',
            type: 'line',
            data: [],
            smooth: true,
            itemStyle: {
                 color: "rgba(39, 110, 255)", //线的颜色以及头部显示的颜色
            },
        }
    ]
};
let humanCounterDate = []
let currenMounth
let currentSelect = 'monthly'
function echartHumanCounterMonthly(){
    let date = document.getElementById('humanCounterDate').value
    let XArr = []
    let YArr = []
    let year = Number(date.slice(0, 4))
    let month = Number(date.slice(5, 7))
    let days = new Date(year, month, 0).getDate()
    let monthotal = 0
    for( let i = 1; i <= days; i++){
        XArr.push(i)
    }
    humanCounterDate.map((mounthItem)=>{
        let total = 0
        mounthItem.map((dayItem)=>{
            total += dayItem
        })
        monthotal += total
        YArr.push(total)
    })
    option.xAxis = {
            type: 'category',
            show: true,
            splitLine: {
                show:
                false
            },
            data: XArr
    }
    option.series[0].data = YArr
    myChart.setOption(option, true);
    document.getElementById('humanCountertotal').innerHTML = `${ langstr.MonthlyCustomerTraffic }  ${monthotal}`
}
function echartHumanCounterDaily(){
    let now_data = new Date( document.getElementById('humanCounterDate').value )
    // let now_data_string = new Date( document.getElementById('humanCounterDate').value ).toLocaleDateString()
    let currentDate = now_data.getDate()
    let now_data_string = `${now_data.getFullYear()}/${ now_data.getMonth() + 1 }/${now_data.getDate()}`
    console.log("echartHumanCounterDaily",now_data_string);
    let time_min = `${now_data.getFullYear()}/${ now_data.getMonth() + 1}/${now_data.getDate()} 00:00:00`
    now_data.setDate(now_data.getDate()+1);
    let time_max =  `${now_data.getFullYear()}/${ now_data.getMonth() + 1}/${now_data.getDate()} 00:00:00`
    let dayArr = []
    let dayTotal = 0
    console.log("echartHumanCounterDaily data:", humanCounterDate[ currentDate - 1 ] );
    humanCounterDate[ currentDate - 1 ].map((item,index)=>{
        let dateItem = [`${now_data_string} ${index}:30:00`,item]
        dayTotal += item
        dayArr.push(dateItem)
    })
    option.xAxis = {
            type: 'time',
            show: true,
            splitLine: {
                show: false
            },
            axisLabel:{
                formatter:function(value){
                    return  new Date(value).toLocaleTimeString().substr(0,5);
                }
            },
            splitNumber: 24,
            min: new Date(time_min),
            max: new Date(time_max)
    }
    option.series[0].data = dayArr
    myChart.setOption(option, true);
    document.getElementById('humanCountertotal').innerHTML = `${ langstr.DailyCustomerTraffic } ${dayTotal}`
}
function humanCounterMonthly(){
    document.getElementById('humanCounterMonthly').className = 'tab_change current'
    document.getElementById('humanCounterDaily').className = 'tab_change'
    currentSelect = 'monthly'
    echartHumanCounterMonthly()
}
function humanCounterDaily(){
    document.getElementById('humanCounterDaily').className = 'tab_change current'
    document.getElementById('humanCounterMonthly').className = 'tab_change'
    currentSelect = 'daily'
    echartHumanCounterDaily()
}
async function humanCounterChangeDate(date){
    let mounth =  date.slice(5, 7)
    console.log("humanCounterChangeDate",'date:',date,'mounth:',mounth);
    if(currenMounth === mounth){
        if(currentSelect === 'daily' ){
            humanCounterDaily()
        }
    }else{
        // 发请求更新数据
        try {
            humanCounterDate =  await getEchartDate(date.slice(0, 7))
        } catch (error) {
            humanCounterDate = []
        }
        if(currentSelect === 'monthly' ){
            humanCounterMonthly()
        }else{
            humanCounterDaily()
        }
        currenMounth = mounth
    }
}
function changeHumanCounterDate(newDate){
    humanCounterDate = newDate
}
function humanCounterEchartInit(){
    document.getElementById('humanCounterDate').value = new Date().toISOString().substr(0, 10);
    currenMounth = new Date().toISOString().substr(5,2);
}
function getEchartDate(date){
    let usr = getCookie('usr')
    let pwd = getCookie('pwd')
    var auth = "Basic " + base64.encode(usr+':'+pwd);
    let sendData = {
        SearchMon: date
    }
    let data = JSON.stringify(sendData)
    return new Promise((resolve,reject)=>{  
        $.ajax({
            type:'POST',
            url:dvr_url + "/netsdk/v2/R/HDCounter",
            dataType:'json',
            data: data,
            beforeSend : function(req ) {
                req.setRequestHeader('Authorization', auth);
            },
            success:function(data){ 
                resolve(data.datas)
            },
            error:function(error){ 
                reject(error)
            }
        })
    })
}
humanCounterEchartInit()
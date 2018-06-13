var townID = null; // 存取接口地址码
var value = "北京"; // 存取输入框字符串

var timer,
    that;

creatScript(value); // 初始化

$("input[type='text']").on('input', function () {
    that = this
    clearTimeout(timer);
    timer = setTimeout(function () {
        value = that.value

        creatScript(value);
    }, 500)
})

function creatScript(data) {
    var oScript = "<script src='http://wthrcdn.etouch.cn/weather_mini?city=" + data + "&callback=dojson'>";
    $(document.body).append(oScript);

    $("script[src^='http']").remove();
}

function dojson(res) {
    var getData = res.data;
    var arr = res.data.forecast;
    getData.yesterday.fengxiang = getData.yesterday.fx;
    getData.yesterday.fengli = getData.yesterday.fl;
    arr.unshift(getData.yesterday);
    createDiv(arr, getData)
}

function createDiv(Arr, GetData) {
    var str = "";
    var getDate = new Date();
    var dat = getDate.getDate(),
        month = getDate.getMonth(),
        year = getDate.getFullYear();

    var high = null,
        low = null,
        date = null;

    var rep = /\d*[\u4e00-\u9fa5]/g,
        fengj = null; // 风级

    Arr.forEach(function (ele, index) {

        high = ele.high.split(" ")[1];
        low = ele.low.split(" ")[1];
        date = ele.date.split("日");

        ele.fengj = ele.fengli.match(rep); // 匹配出A开头的<![CDATA[3-4级]]> 中的A[3-4级] 然后通过字符串函数操作 截取中间位置字符串 渲染样式

        if (dat == parseInt(date[0])) {
            // dat 系统“日” ， date 回传“日”
            GetData.wendu = GetData.wendu;
            GetData.tips = GetData.ganmao;
            GetData.wend = GetData.wendu;
            date[1] = "今天";
        } else {
            if(dat-1 == parseInt(date[0])){ date[1] = "昨天";};
            if(dat+1 == parseInt(date[0])){ date[1] = "明天";};
            GetData.wend = (parseInt(high) + parseInt(low)) / 2 + 2;
            GetData.tips = "算命的还没算出来今天是个啥情况";
        }
        str += '<div class="cards">\
        <div class="top">\
            <div class="address-div">\
                <span class="address">'+ GetData.city + '</span>\
                <span class="address-con"></span>\
            </div>\
            <div class="top-mid">'+ GetData.wend + '</div>\
            <div class="top-bottom">'+ year + '/' + month + '/' + date[0] + '</div>\
        </div>\
        <div class="content">\
            <div class="tips">'+ GetData.tips + '</div>\
            <div class="date-type">\
                <span class="date">'+ date[1] + '</spna>\
                    <span class="type">'+ ele.type + '</span>\
            </div>\
            <div class="content-list">\
                <ul>\
                    <li>\
                        <span class="list-left">最高温</span>\
                        <i class="vertical-line"></i>\
                        <span class="list-right">'+ high + '</span>\
                    </li>\
                    <li>\
                        <span class="list-left">最低温</span>\
                        <i class="vertical-line"></i>\
                        <span class="list-right">'+ low + '</span>\
                    </li>\
                    <li>\
                        <span class="list-left">风力</span>\
                        <i class="vertical-line"></i>\
                        <span class="list-right">'+ ele.fengj + '</span>\
                    </li>\
                    <li>\
                        <span class="list-left">风向</span>\
                        <i class="vertical-line"></i>\
                        <span class="list-right">'+ ele.fengxiang + '</span>\
                    </li>\
                </ul>\
            </div>\
        </div>\
    </div>';
    })

    $(".scroll-div").html(str)

}

$(".btn-card-left").on('click', function () {
    $(".scroll-div").stop().animate({ left: 0 + "px" }, 300);

})

$(".btn-card-right").on('click', function () {
    $(".scroll-div").stop().animate({ left: -600 + "px" }, 300);

})


var flag = 0;

//左右滑动翻页
$(".scroll-div").on('touchstart', function (e) {

    //touchstart事件
    var $tb = $(this);
    var startX = e.touches[0].clientX, // 手指触碰屏幕的x坐标
        pullDeltaX = 0;
    $tb.on('touchmove', function (e) {

        //touchmove事件
        var x = e.touches[0].clientX; // 手指移动后所在的坐标

        pullDeltaX = x - startX; // 移动后的位移
        if (!pullDeltaX) {
            return;
        }
        e.preventDefault(); // 阻止手机浏览器默认事件
    });

    $tb.on('touchend', function (e) {

        //touchend事件
        $tb.off('touchmove touchend'); 
        
        // 解除touchmove和touchend事件
        e.stopPropagation();

        // 判断移动距离是否大于30像素
        if (pullDeltaX > 30) {
            if (flag != 0) {
                $(".scroll-div").stop().animate({ left: "+=" + 100 + "%" }, 300);
                flag--;
            }

            // 右滑，往前翻所执行的代码
        } else if (pullDeltaX < -30) {

            if (flag != 5) {
                $(".scroll-div").stop().animate({ left: "-=" + 100 + "%" }, 300);
                flag++;
            }
        }
    });
})

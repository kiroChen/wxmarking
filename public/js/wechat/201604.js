$(function() {
	$(".main").onepage_scroll({
		sectionContainer: "section",
		easing: 'ease'
	});
	$('.last_btnPrize').bind("touchstart",
	function() {
        //lottery(numRand());
        $.ajax({
            url:'/marking/201604/lottery',
            dataType: 'json',
            type: "POST",
            success: function(data)	{
                 console.log(data);
                //wx.config(data);
            },
            error: function(xhr,textStatus,error){
                //alert('获取wx.config时错误！');                                                                             
            }
        });
	});
});

var clientWidth, serverWidth; (function(doc, win) {
	var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange': 'resize',
	recalc = function() {
		clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
		serverWidth = 20 * (clientWidth / 320);
	};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//内容一页中的选题A,B,C
$(".imgHov1").bind("touchstart",
function(e) {
	//alert("12");
	$(".imgHov2").show();
	$(".imgHov1").hide();
	if (e && e.stopPropagation) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true
	}
});
$(".imgHov3").bind("touchstart",
function(e) {
	$(".imgHov4").show();
	$(".imgHov3").hide();
	if (e && e.stopPropagation) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true
	}
});
$(".imgHov5").bind("touchstart",
function(e) {
	$(".imgHov6").show();
	$(".imgHov5").hide();
	if (e && e.stopPropagation) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true
	}
});
//内容二页中的选题A,B,C,D
$(".imgHov01").bind("touchstart",
function(e) {
	$(".imgHov02").show();
	$(".imgHov01").hide();
	if (e && e.stopPropagation) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true
	}
});
$(".imgHov03").bind("touchstart",
function(e) {
	$(".imgHov04").show();
	$(".imgHov03").hide();
	if (e && e.stopPropagation) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true
	}
});
$(".imgHov05").bind("touchstart",
function(e) {
	$(".imgHov06").show();
	$(".imgHov05").hide();
	if (e && e.stopPropagation) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true
	}
});
$(".imgHov07").bind("touchstart",
function(e) {
	$(".imgHov08").show();
	$(".imgHov07").hide();
	if (e && e.stopPropagation) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true
	}
});
//点击抽奖页面中的活动介绍显示活动介绍面板
$(".last_actclick1").bind("touchstart",
function() {
	$(".h5actpl_show").show();
});
$(".last_colbtn1").bind("touchstart",
function() {
	$(".h5actpl_show").hide();
});
//点击抽奖页面中的中奖名单显示中奖名单面板
$(".last_actclick2").bind("touchstart",
function() {
	$(".prizelist_show").show();
});
$(".last_colbtn2").bind("touchstart",
function() {
	$(".prizelist_show").hide();
});
//点击首页显示内容一页
$(".page1_click").bind("touchstart",
function() {
	$(".page2_click").show();
});
//点击内容一页显示内容二页
$(".page2_click").bind("touchstart",
function() {
	$(".page3_click").show();
});
//点击内容二页显示抽页
$(".page3_click").bind("touchstart",
function() {
	$(".page4_click").show();
});
//抽奖功能
function numRand() {
	var rand = parseInt(Math.random() * 4);
	switch (rand) {
	case 1:
		rand = 111;
		break;
	case 2:
		rand = 222;
		break;
	default:
		rand = 333;
	}
	return rand;
}
var isBegin = false;
var lottery = function(result) {
    var u;
    var num = 4.5 * serverWidth;
    u = num;
    if (isBegin) return false;
    isBegin = true;
    $(".num").css('backgroundPositionY', 0);
    var num_arr = (result + '').split('');
    $(".num").each(function(index) {
        var _num = $(this);
        setTimeout(function() {
            _num.animate({
                backgroundPositionY: (u * 60) - (u * num_arr[index])
            },
            {
                duration: 6000 + index * 3000,
                easing: "easeInOutCirc",
                complete: function() {
                    if ($(".num").length == (index + 1)) {
                        isBegin = false
                        if (num_arr[0] == num_arr[1] && num_arr[0] == num_arr[2]) {
                            if (num_arr[0] != 1 && num_arr[0] != 2) return false; //没中奖
                            if (num_arr[0] == 1) {
                                console.log('抽中红包');
                            }
                            if (num_arr[0] == 2) {
                                console.log('抽中手表');
                            }
                        }
                    };
                }
            });
        },
        index * 300);
    });
}

$('.last_shop').bind("touchstart",
function() {
	window.location.href = "http://m.jd.com/product/10085542277.html";
})
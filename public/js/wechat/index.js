$(function() {
    $.ajax({
        url:'/common/wxConfig?url='+encodeURIComponent($(location).attr('href')),
        dataType: 'json',
        type: "GET",
        success: function(data)	{
            wx.config(data);
        },
        error: function(xhr,textStatus,error){
            alert('获取wx.config时错误！');                                                                             
        }
    });
    
    wx.ready(function() {
        wx.onMenuShareTimeline({
            title: ' 欢酷踏青抽奖，抢微信万元现金红包&赢欢酷儿童电话手表', // 分享标题
            link: $(location).attr('href'), // 分享链接
            imgUrl: '/images/201604/sharelogo.jpg', // 分享图标
            success: function () {
                $.post('/marking/201604/shareCallback',{},function(result) {
                    window.location.href = $(location).attr('href');
                });
            },
            cancel: function () {
                
            }
        });
    });
})
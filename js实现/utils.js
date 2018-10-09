/**
 * Created by Administrator on 2017/7/12.
 */
var utils={
    //切换tab
    tab: function (nav,ele,className) {//nav->string，切换栏；ele->切换对应的内容。className为导航栏激活的状态。
        $("body").on("click",nav,function(){
            $(this).siblings().removeClass(className);
            $(this).addClass(className);
            $(ele).hide();
            $(ele).eq($(this).index()).show();
        });
    },
    //关注按钮点击切换
    careTab: function (ele,className) {
        $("body").on("click",ele,function(){
            if($(this).hasClass(className)){
                $(this).removeClass(className).html("关注");
            }else{
                $(this).addClass(className).html("已关注");
            }
        });
    },
    //向左跑马灯
    scrollLeft: function ($obj) {
        var $child=$obj.children().clone();
        $obj.append($child);
        var initLeft=0;
        var timer=null;
        clearInterval(timer);
        timer=setInterval(function () {
            initLeft=$obj.scrollLeft();
            initLeft++;
            /*    console.log(initLeft);
             console.log($child.width());*/
            if(initLeft>=$child.width()){
                initLeft-=$child.width();
            }
            $obj.scrollLeft(initLeft);
        },30);
    },
    //向上跑马灯
    scrollTop: function ($obj) {
        var $child=$obj.children().clone();
        $obj.append($child);
        var initTop=0;
        var timer=null;
        clearInterval(timer);
        timer=setInterval(function () {
            initTop=$obj.scrollTop();
            initTop++;
            /*console.log(initTop);
             console.log($child.height());*/
            if(initTop>=$child.height()){
                initTop-=$child.height();
            }
            $obj.scrollTop(initTop);
        },30);
    }
};
//弹窗出来
var $body=$("body");
function popBoxShow($pop) {
    scrollTop = $body.scrollTop();
    $body.addClass("popShow");
    $(".mask").show();
    $pop.show();
}
function popBoxHide($pop){
    $(".mask").hide();
    $pop.hide();
    $body.removeClass("popShow").scrollTop(scrollTop);
}
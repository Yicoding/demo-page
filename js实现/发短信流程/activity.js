var urlHeader = '//zqhd.eastmoney.com'; // 本地测试
// var urlHeader = ''; // 测试线
// var urlHeader = ''; // 正式线
//验证
var validator = {
    //验证手机号
    checkTelNumber: function (value) {
      return /^[1][3456789][0-9]{9}$/.test(value);
    },
    //验证图形验证码
    checkGraphCode: function (value) {
      return /^[a-zA-Z0-9]{4}$/.test(value);
    },
    //验证短信验证码
    checkMessageVCode: function (value) {
      return /^[0-9]{4,6}$/.test(value);
    },
    //检验点击“提交”时是否已获取短信验证码
    isGetMessageCode: function () {
      if (!$(".btn-code").hasClass("isClicked")) {
        return true;
      }
    }
};

// 方法
var options = {
  // 只能输入数字
  limitNum: function(e) {
    e.value=e.value.replace(/\D/g,'')
  },
  // 监测手机号长度变化
  mobileWatch: function(e) {
    form.img.value = '';
    form.code.value = '';
    options.showTip('')
    if (e.value.length === 11) {
      $('.form-img').show();
      options.refreshGraphCode();
    } else {
      $('.form-img').hide();
    }
  },
  // 刷新图形验证码
  refreshGraphCode: function() {
    form.img.value = '';
    form.code.value = '';
    $('.img-code').attr('src', urlHeader + '/Api/SMS/GetVerifyImg?rand=' + Math.random());
  },
  // 提示错误信息
  showTip: function(tip) {
    $('.tip').html(tip)
  },
  // 使短信验证码按钮高亮
  btnActive: function(e) {
    if (e.value.length === 4) {
      $('.btn-code').addClass('btn-active');
    } else {
      $('.btn-code').removeClass('btn-active');
    }
  },
  // 发送获取短信验证码请求
  getMessageCode: function() {
    var url = urlHeader + "/api/SMS/SendActionVerificationCodePK?mobile=" + form.mobile.value + "&vCode=" + form.img.value + '&type=' + Math.random();
    EM.ajax({
      type: "GET",
      url: url,
      data: null,
      async: true,
      crossDomain: true,
      credential: true,
      dataType: "json",
      success: function(json) {
        if (json.IsSuccess) {
          $(".btn-code").addClass("isClicked");
          if (json.Data === 0) {
            options.showTip('短信验证码已发送，请留意！');
            options.timeStart();
          } else if (json.Data === 1) {
            options.refreshGraphCode();   // 刷新验证码
            options.showTip('图形验证码错误！');
          } else if (json.Data === -1) {
            options.showTip('网络异常！');
          } else if (json.Data === 2) {
            options.showTip('服务器繁忙，请稍后再试！');
          }
        } else {
          $(".btn-code").removeClass("on");
          options.refreshGraphCode();   // 刷新验证码
          options.showTip('服务器繁忙，请稍后再试！');
        }
      },
      error: function(err) {
        $(".btn-code").removeClass("on");
        options.refreshGraphCode();   // 刷新验证码
        options.showTip('服务器繁忙，请稍后再试！');
      }
    })
  },
  // 提交竞猜结果
  submitApplications: function() {
    var url = urlHeader + "/api/SMS/CheckActionVerificationCodePK?rand=" + Math.random();
    var data = {};
    EM.ajax({
      url: url,
      type: "POST",
      async: true,
      data: JSON.stringify(data),
      dataType: "json",
      headers: {
        "Content-Type": "application/json"
      },
      success: function(json) {
        if (json.IsSuccess) {
          if (json.Data === 0) {
            // 请求成功
          } else if (json.Data === 1) {
            options.showTip('图形验证码错误！');
          } else if (json.Data === -1) {
            options.showTip('网络异常！');
          } else if (json.Data === 2) {
            options.showTip('服务器繁忙，请稍后再试！');
          }
        } else {
          $(".btn-send").removeClass("on");
          options.showTip('服务器繁忙，请稍后再试！');
        }
      },
      error: function(err) {
        $(".btn-send").removeClass("on");
        options.showTip('服务器繁忙，请稍后再试！');
      }
    })
  },
  //倒计时
  timeStart: function() {
    window.clearInterval(a);
    t = 60;
    options.timeStep();
    a = setInterval(options.timeStep, 1000);
	  $('.btn-code').removeClass('btn-active');
  },
  timeStep: function() {
    t--;
    if (t <= 0) {
      $('.btn-code').removeClass("on").html("短信验证码").addClass('btn-active');
      window.clearInterval(a);
    } else {
      $('.btn-code').addClass("on").html("剩余时间" + t + "s");
    }
  },
  //检验点击“提交我的选择按钮”时是否已获取短信验证码
  isGetGraphCode: function () {
    if (!$(".btn-code").hasClass("isClicked")) {
      return true;
    }
  }
};

// 禁止连续点击发送按钮
function toggleClick(e) {
  var target = e.target;
  if ($(target).hasClass("on")) {
    return false;
  }
  $(target).addClass("on");
  return true;
}
// 点击短信验证码按钮
$('.btn-code').click(function(e) {
  if (!form.mobile.value.length) {
    options.showTip('手机号不能为空！');
  } else if (form.mobile.value.length < 11) {
    options.showTip('请输入11位手机号！');
  } else if (!validator.checkTelNumber(form.mobile.value)) {
    options.showTip('请输入正确的手机号！');
  } else if (!form.img.value) {
    options.showTip('图形验证码不能为空');
  } else if (!validator.checkGraphCode(form.img.value)) {
    options.showTip('请输入正确的图形验证码！');
  } else {
    options.showTip('');
    toggleClick(e) &&
    options.getMessageCode();
  }
});
// 点击提交我的选择按钮
$('.btn-send').click(function() {
  if (!form.mobile.value.length) {
    options.showTip('手机号不能为空！');
  } else if (form.mobile.value.length < 11) {
    options.showTip('请输入11位手机号！');
  } else if (!validator.checkTelNumber(form.mobile.value)) {
    options.showTip('请输入正确的手机号！');
  } else if (!validator.isGetGraphCode()) {
    options.showTip('请先点击“短信验证码”按钮，获取短信验证码！');
  } else if (!form.code.value) {
    options.showTip('请输入短信验证码！');
  } else if (!validator.checkMessageVCode(form.code.value)) {
    options.showTip('请输入正确的短信验证码！');
  } else {
    options.showTip('');
    toggleClick(e) &&
    options.submitApplications();
  }
});
// h5分享
function RequestURL(QueryString) {
	var strHref = window.location.href;
	var strParm = "";
	if (strHref.search(/\?/) != -1) {
	  strHref = strHref.substr(strHref.search(/\?/) + 1);
	  strHref = strHref.split(/&/);
	  for (var icount = 0; icount < strHref.length; icount++) {
		if (strHref[icount].search("^" + QueryString + "=") != -1) {
		  strParm = strHref[icount].substr(QueryString.length + 1);
		}
	  }
	  return (strParm);
	}
	return (strParm);
}
var ad_id = RequestURL("ad_id");

emH5.Share({
	title: "标题",
	desc: "描述",
	link: window.location.origin + "/Html/aghd/native/6/20180612/html/share.html?ad_id=" + ad_id,
	imgUrl: window.location.origin + "/Html/aghd/native/6/20180612/resource/img/share.png",
	app: true
});

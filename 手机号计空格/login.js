$(function () {
    // $("input[type='text']").blur(function () {
    //     $(this).siblings('.n_tips').hide();
    // });

    // 登录与注册选项卡切换
    $("#login").click(function(){
        $("#register").fadeOut(1000,function(){
            $('title').html('登录创衣客商城');
        	$("#register_user").val("");
        	$("#register-verification-code").val("");
        	$("#register_code").val("");
        });
    })
    $("#free_register").click(function(){
        $("#register").fadeIn(1000,function(){
            $('title').html('注册创衣客商城账号');
        	$("#log_user").val("");
        	$("#log_code").val("");
        });
    })
    //密码框显示切换
    $('.user-password a,.register-password a').click(function(){
        changeInputType(this)
    })

    // 登录按钮
    $("#login_btn").click(function () {
        login();
    });

    // 用户协议按钮
    $('#checkLabel').on('click',checkbox);
    /**
     * 各个input的实时校验
     * */
    var Flag1,Flag2,Flag3;

    // 注册用户名校验
    var checkPhone = true;
    $('#register_user').on('focus',function(){
        $('#register_user').attr('placeholder','');
        $("#register_user").siblings('div').removeClass('n_tips').addClass('g_tips').html('你可以使用该手机号码登录和找回密码').show();
    	$("#log_user").val("");
    	$("#log_code").val("");
        Flag1 = false;
        $(".register-number").addClass('n_error');
        if ($('#verification-code-btn').html() == '获取验证码') {
            $("#register_user").next().find('img').hide();
            $("#register_user").siblings('div').show();
            //改变验证码按钮样式，绑定事件
            $('#verification-code-btn').removeClass('verification-code-btn-allow').addClass('verification-code-btn');
        }
    }).on('input',function (e) {
        var val = $(this).val();
        var arr = val.split(' ');
        var Arr = [];
        var Str = '';
        for(var i = 0 ; i < arr.length ; i ++){
            var arr1 = arr[i].split('');
            for(var j = 0 ; j < arr1.length ; j ++){
                Arr.push(arr1[j]);
            }
        }
        // console.log(Arr);
        if(Arr.length > 3 && Arr.length <=7){
            Arr.splice(3,0,' ');
        }else if(Arr.length > 7){
            Arr.splice(7,0,' ');
            Arr.splice(3,0,' ');
        }
        Arr.forEach(function(ele,index){
            Str += ele;
        })
        $(this).val(Str);
    }).on('blur',function(){
        // 校验手机号格式
        Flag1 = false;
        $('#register_user').attr('placeholder','常用手机号码');
        var telRule = /^1\d{10}$/;
        var x = $("#register_user").val().replace(/\s/g,"")
        if (x == '') {
            $(".register-number").addClass('n_error');
            $("#register_user").siblings('div').removeClass('g_tips').addClass('n_tips').html('请输入11位手机号码').show();
            //$("#register_user").next().find('img').attr('src',$('#basePath').val() + '/static${staticVersion}/images/err.png').show();
            $("#register_user").next().find('img').hide();
            return false;
        }
        else if (!telRule.test(x)) {
            $(".register-number").addClass('n_error');
            $("#register_user").siblings('div').removeClass('g_tips').addClass('n_tips').html('请输入11位手机号码').show();
            //$("#register_user").next().find('img').attr('src',$('#basePath').val() + '/static${staticVersion}/images/err.png').show();
            $("#register_user").next().find('img').hide();
            return false;
        }
        else {
        	if(checkPhone == true){
                checkPhone = false;
        		$.ajax({
        			async: false,
        			type: 'POST',
        			url: $('#basePath').val() + '/register/checkexistsByInfoPhone',
        			dataType: 'json',
        			data: {'username': x},
        			timeout: 6000,// 限超时6秒
        			success: function (data) {
//                    console.log(data);
                        checkPhone = true;
        				if(data == 1){
        					$(".register-number").addClass('n_error');
        					$("#register_user").siblings('div').removeClass('g_tips').addClass('n_tips').html('此号码已注册，可以直接登录～').show();
        					return false;
        				}else{
        					Flag1 = true;
        					$(".register-number").removeClass('n_error');
        					if($('#verification-code-btn').html() == '获取验证码'){
        						$("#register_user").next().find('img').show();
        						$("#register_user").siblings('div').hide();
        						//改变验证码按钮样式，绑定事件
        						$('#verification-code-btn').removeClass('verification-code-btn').addClass('verification-code-btn-allow')
        						.on('click',verificationCode)
        					}
        				}
        			},
            		complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            			if(status=='timeout' || status=='error'){//超时,status还有success,error等值的情况
                            checkPhone = true;
            			}
            		}
        		});
        	}
        }
    })
    //发送验证码
    var sendNotice = true;
    function verificationCode(){
        if(sendNotice == true){
            sendNotice = false;
            $('#register-verification-code').prop("readonly",false);
            var x = $("#register_user").val().replace(/\s/g,"");
            //发起ajax
            $("#register-verification-code").siblings('div').removeClass('n_tips').addClass('g_tips').html('验证码已发送，5分钟内输入有效').show();
            $('#verification-code-btn').removeClass('verification-code-btn-allow').addClass('verification-code-btn').unbind('click');
            var second = 60;
            var timeId = setInterval(function(){
                if(second < 0){
                    $('#verification-code-btn').removeClass('verification-code-btn').addClass('verification-code-btn-allow').on('click',verificationCode);
                    $('#verification-code-btn').html('重新发送');
                    clearInterval(timeId);
                    return false;
                }
                $('#verification-code-btn').html(second-- + 's 重新发送');
            },1000);
        	$.ajax({
        		async: false,
        		type: 'POST',
        		url: $('#basePath').val() + '/register/sendMobileNotice',
        		dataType: 'json',
        		data: {'username':x},
        		timeout: 6000,// 限超时6秒
        		success: function(data){
//                console.log(data);
        			sendNotice = true;
        			if(data == true){
        				$("#register-verification-code").siblings('div').removeClass('n_tips').addClass('g_tips').html('验证码已发送，5分钟内输入有效').show();
        			}else if(data == false){
        				$("#register-verification-code").siblings('div').removeClass('g_tips').addClass('n_tips').html('验证码发送失败，请稍后重试').show();
        			}else {
                        $("#register-verification-code").siblings('div').removeClass('g_tips').addClass('n_tips').html('点击过于频繁，请稍等').show();
                    }
        		},
        		complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
        			if(status=='timeout' || status=='error'){//超时,status还有success,error等值的情况
        				sendNotice = true;
        			}
        		}
        	});
        }
    }
    //验证码的校验
    $('#register-verification-code').on('focus',function(){
        if( $('#register-verification-code').prop("readonly") == false) {
            $('#register-verification-code').attr('placeholder', '');
            $("#register-verification-code").siblings('div').removeClass('n_tips').addClass('g_tips').html('你可以使用该验证码登录和找回密码').show();
        }
        return false;
    }).on('blur',function(){
        Flag2 = false;
        $('#register-verification-code').attr('placeholder','验证码');
        if( $('#register-verification-code').prop("readonly") == false){
            var verificationCode = $('#register-verification-code').val().trim();
            var regC = /^\d{6}$/;
            if (verificationCode == ''){
                $('#register-verification-code').addClass('n_error');
                $("#register-verification-code").siblings('div').removeClass('g_tips').addClass('n_tips').html('请输入验证码').show();
                $("#register-verification-code").val("");
                return false;
            }else if(!regC.test(verificationCode)){
                $('#register-verification-code').addClass('n_error');
                $("#register-verification-code").siblings('div').removeClass('g_tips').addClass('n_tips').html('请输入6位验证码').show();
                $("#register-verification-code").val("");
                return false;
            }else{
                $('#register-verification-code').removeClass('n_error');
                $("#register-verification-code").siblings('div').hide();
                $('#register_code').val('');
                Flag2 = true;
            }
        }else{
            return false;
        }
    })
    //注册密码的校验
    $('#register_code').on('focus',function(){
        if(Flag1 && Flag2){
            //绑定注册事件
            $("#register_btn").css({
                "background":"#c61b09",
                "color":"#fff",
                "cursor":"pointer"
            }).click(function(){
                register();
            })
        }
        $('#register_code').attr('placeholder','');
        $("#register_code").siblings('div').removeClass('n_tips').addClass('g_tips').html('密码为6-16位字母数字组合').show();
    }).on('blur',function(){

        //校验密码格式
        Flag3 = false;
        $('#register_code').attr('placeholder','密码（6-16位字母数字组合）');
        var y = $("#register_code").val();
        var regS = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
        if (y == '') {
            $(".register-password").addClass('n_error');
            $("#register_code").siblings('div').removeClass('g_tips').addClass('n_tips').html('请输入密码').show();
            $("#register_code").val("");
            return false;
        }
        else if (!regS.test(y)) {
            $(".register-password").addClass('n_error');
            $("#register_code").siblings('div').removeClass('g_tips').addClass('n_tips').html('密码为6-16位字母数字组合').show();
            return false;
        }
        else {
            $(".register-password").removeClass('n_error');
            $("#register_code").siblings('div').hide();
            Flag3 = true;
        }
    })
    // 同意用户协议
    var result = true;
    function checkbox() {
        if (result==true){
            $('#checkLabel').text('');
            $('#checkLabel').css('background','#c61b09');
            result=false;
        }else if(result==false){
            $('#checkLabel').text('√');
            $('#checkLabel').css({'color':'#fff','background':'#c61b09'});
            result=true;
        }
    }
    //注册功能

    var registerClick = true;
    function register() {
        if(!result){
            $("#register-verification-code").siblings('div').removeClass('g_tips').addClass('n_tips').html('请先同意《创衣客用户服务协议》').show();
        }else if (Flag1 && Flag2 && Flag3 && result) {
//            console.log('提交注册')
            $("#register_code").get(0).setAttribute("type", "password");
            //$("input[type='text']").next().next().hide();
            if(registerClick == true){
    			registerClick = false;
            	$.ajax({
            		url: $('#basePath').val() + "/register/addcustomer",
            		type: "POST",
            		dataType: "JSON",
            		data: {
            			username: $("#register_user").val().replace(/\s/g,""),
            			password: $("#register_code").val(),
            			patchca: $("#register-verification-code").val()
            		},
            		timeout: 6000,// 限超时6秒
            		success: function (data) {
            			if(data && data.status == 1){
            				$('.reg_success').show();
            				var time = 2;
            				var timeId = setInterval(function(){
            					if(time <= 0){
            						$.ajax({
            							url: $('#basePath').val() + "/login.html",
            							type: "POST",
            							dataType: "JSON",
            							data: {
            								username: $("#register_user").val().replace(/\s/g,""),
            								password: $("#register_code").val(),
            								url: decodeURI($("#urlhide").val()),
            								type: ''
            							},
            							success: function (data) {
            								if (data && data.code == 0) {
            									//console.log('urlRedirect',$('#urlRedirect').text());
                                                var urlRedirect = $('#urlRedirect').text()
                                                if(urlRedirect){
                                                    window.location = urlRedirect;
                                                }else{
                                                    window.location = $('#basePath').val() + "/index.html";
                                                }
            								} else {
                                                registerClick = true;
            									$('.reg_success').hide()
            									$('.reg_fail').show();
            									$('.reg_success_text').html('自动登录失败，请稍后重试');
            									$('.reg_success_text2').html('');
            									var time = 2;
            									var timeId = setInterval(function(){
            										if(time <= 0){
            											window.location = $('#basePath').val() + "/login.html";
            											clearInterval(timeId);
            											return false
            										}
            										$('#reciprocal2').html(time--);
            									},1000)
//                                            console.log('自动登录失败')
            									//Dialog.warning('自动登录失败,'+ data.msg)
            									//$("#register_code").siblings('div').removeClass('g_tips').addClass('n_tips').html(data.msg).show();
            								}
            							}
            						});
            						clearInterval(timeId);
            						return false
            					}
            					$('#reciprocal1').html(time--);
            				},1000)
            			}else if(data && data.status == 0) {
                            registerClick = true;
            				if (data.message == '验证码过期或错误') {
            					$('#register-verification-code').addClass('n_error');
            					$("#register-verification-code").siblings('div').removeClass('g_tips').addClass('n_tips').html('验证码过期或错误').show();
            				} else if (data.message == '手机号已注册') {
            					$(".register-number").addClass('n_error');
            					$("#register_user").siblings('div').removeClass('g_tips').addClass('n_tips').html('此号码已注册，可以直接登录～').show();
            				} else if (data.message == '注册密码格式不对') {
            					$(".register-password").addClass('n_error');
            					$("#register_code").siblings('div').removeClass('g_tips').addClass('n_tips').html('密码为6-16位字母数字组合').show();
            				}
            			}else{
                            registerClick = true;
            				$('.reg_fail').show();
            				var time = 2;
            				var timeId = setInterval(function(){
            					if(time <= 0){
            						window.location.reload();
            						clearInterval(timeId);
            						return false
            					}
            					$('#reciprocal2').html(time--);
            				},1000)
            			}
            		},
            		complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            			if(status=='timeout' || status=='error'){//超时,status还有success,error等值的情况
            				registerClick = true;
            			}
            		}
            	});
            }
        }
    }

    /**
     * 登录功能
     * */
    function login() {
        if (checkInput1()) {
            var type = "";
            $("#log_code").get(0).setAttribute("type", "password");
            $("input[type='text']").next().next().hide();           
            $.ajax({
                url: $('#basePath').val() + "/login.html",
                type: "POST",
                dataType: "JSON",
                data: {
                    username: $("#log_user").val(),
                    password: $("#log_code").val(),
                    url: decodeURI($("#urlhide").val()),
                    type: type
                },
                success: function (data) {
                    if (data && data.code == 0) {
                    	if (data.redirectUrl.length>0){
                    		window.location= data.redirectUrl;
                    	}else{
						//console.log('urlRedirect',$('#urlRedirect').text());
                    		window.location = $('#urlRedirect').text();
                    	}
                    } else {
                        $("#log_code").next().show().html(data.msg);
                    }
                },
                error :function (data){
                	Dialog.alert("请刷新页面重新登录");
                }
            });
        }
    }


    // 校验登录帐号和密码
    function checkInput1() {
        var flag = false;
        var telRule = /^1\d{10}$/;
        var emailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        var x = $("#log_user").val().trim();
        if (x == '') {
            $("#log_user").addClass('n_error');
            $("#log_user").next().html('请输入手机号或邮箱');
            $("#log_user").next().show();
            return flag;
        }
        else if (!telRule.test(x) && !emailRule.test(x)) {
            $("#log_user").addClass('n_error');
            $("#log_user").next().html('请输入正确的手机号或邮箱');
            $("#log_user").next().show();
            return flag;
        }
        else {
            $("#log_user").removeClass('n_error');
            $("#log_user").next().hide();
            flag = true;
        }
        var flagP = false;
        y = $("#log_code").val();
        var regS = /\s/g;
        if (regS.test(y)) {
            $("#log_code").addClass('n_error');
            // $("#log_code").next().addClass('tips_error');
            $("#log_code").next().html('请勿输入空格');
            $("#log_code").val("");
            $("#log_code").next().show();
            return flagP;
        }
        else if (y == '') {
            $("#log_code").addClass('n_error');
            //$("#log_code").next().addClass('tips_error');
            $("#log_code").next().html('请输入登录密码');
            $("#log_code").next().show();
            return flagP;
        }
        else {
            $("#log_code").removeClass('n_error');
            $("#log_code").next().hide();
            flagP = true;
        }
        return flag && flagP;
    }


    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13 && $('#register').css('display') == 'none') { // enter 键
            login();
        }else if(e && e.keyCode == 13 && $('#register').css('display') == 'block'){
            $('#register_code').blur();
            register();
        }
    };

    function changeInputType(n) {
        if ($(n).siblings('input').attr("type") == "password") {
            $(n).siblings('input').prop("type", "text");
            $(n).parent().css("background-image","url("+ $('#basePath').val() + "/static"+ $('#staticVersion').val() +"/images/password-1.png");
            $(n).css("background-image","url("+ $('#basePath').val() +"/static"+ $('#staticVersion').val() +"/images/hide.png)");
            return;
        }
        if ($(n).siblings('input').attr("type") == "text") {
            $(n).siblings('input').prop("type", "password");
            $(n).parent().css("background-image","url("+ $('#basePath').val() + "/static"+ $('#staticVersion').val() +"/images/password-2.png")
            $(n).css("background-image","url("+ $('#basePath').val() +"/static"+ $('#staticVersion').val() +"/images/hidePsd.png)");
            return;
        }
    };

    function removeError() {
        $("#log_code").siblings('.n_tips').hide();
    }
});
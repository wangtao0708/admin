function submitForm() {
    if ($('.login-form').validate().form()) {
        //先禁用按钮
        $("#aLogin").addClass("disabled");
        $("#aLogin").unbind("click");
        //然后Ajax方式提交
        $.ajax({
            url: '../../Account/Validate?username=' + $("#username").val() + '&password=' + $('#password').val(),
            cache: false,
            dataType: "json",
            success: function (result) {
                $("#aLogin").removeClass("disabled");
                $("#aLogin").click(function () {
                    submitForm();
                })
                if (result) {
                    if ($("#remember").attr("checked") == "checked") {
                        //记住用户名和密码
                        $.cookie('username', $("#username").val(), { expires: 7 });
                        $.cookie('password', $('#password').val(), { expires: 7 });
                    }
                    else {
                        $.cookie('username', null, { expires: -1 });
                        $.cookie('password', null, { expires: -1 });
                    }

                    document.forms[0].submit();
                }
                else {
                    $(".alert-error2").fadeIn('slow').delay(3000).fadeOut('slow');
                }
            }
        });
    }
}

var Login = function () {
    
    return {
        //main function to initiate the module
        init: function () {

            //张庆广添加：设置图片路径为 http://website/content/image/bg/1.jgp  否则会将图片路径默认为：document.baseURI + content/image/bg/1.jpg
            //var urlArray = document.baseURI.split("/");
            //var baseUrl = urlArray[0] + "/" + urlArray[1] + "/" + urlArray[2] + "/";
            var baseUrl = "../../";
           $('.login-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                username: {
	                    required: "请输入用户名。"
	                },
	                password: {
	                    required: "请输入密码。"
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	                //$('.alert-error', $('.login-form')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	                form.submit();
	            }
	        });

           $('.login-form input').keypress(function (e) {
	            if (e.which == 13) {
	                submitForm();
	            }
	        });

	        $.backstretch([ 
		        baseUrl+"content/image/bg/1.jpg",
		        baseUrl + "content/image/bg/2.jpg",
		        baseUrl + "content/image/bg/3.jpg",
		        baseUrl + "content/image/bg/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		      });
        }

    };

}();


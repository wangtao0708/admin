var SalesEidt = function () {
    return {
        init: function () {
            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='assets/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }
            var $t = this;
            var form = $('#edit_form');
            var error = $('.alert-error', form);
            var success = $('.alert-success', form);
            $(".control-userinfo").attr("readonly","readonly");

            //新建联系人
            $("#ContactID").change(function () {
                var $this = $(this).find("option:selected");
                var val = $this.attr("value");
                if ($(this).val() == 0) {
                    //$("input[name='ContactID']").val("0");
                    $(".control-userinfo").removeAttr("readonly");
                    $("input[name='ContactName']").val("");
                    $("input[name='Email']").val("");
                    $("input[name='Phone']").val("");
                    $("input[name='QQ']").val("");
                    $("input[name='Weixin']").val("");
                    $("textarea[name='ContactRemark']").val("");
                } else {
                    
                    $.getJSON($t.getBaseUri() + "GetContactEntityByID/" + val, function (data) {
                        $(".control-userinfo").attr("readonly", "readonly");
                        $("input[name='ContactID']").val(data.ContactID);
                        $("input[name='ContactName']").val(data.ContactName);
                        $("input[name='Email']").val(data.Email);
                        $("input[name='Phone']").val(data.Phone);
                        $("input[name='QQ']").val(data.QQ);
                        $("input[name='Weixin']").val(data.Weixin);
                        $("textarea[name='ContactRemark']").val(data.ContactRrmark);

                        form.valid();
                    });
                }
            });

            //根据销售单状态，显示/隐藏订单信息
            jQuery("#State").change(function () {
                if ($(this).val() == 3) {
                    $(".order-info").css("display", "block");
                } else {
                    $(".order-info").css("display", "none");
                }
                
                if ($(this).val() >= 2) {
                    $(".SchemeTime").css("display", "block")
                } else {
                    $(".SchemeTime").css("display", "none")
                }

            });

            $('.date-picker').datepicker({
                rtl: App.isRTL()
            });

            jQuery.validator.addMethod("isMobile", function (value, element) {
                var length = value.length;
                var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
                return this.optional(element) || (length == 11 && mobile.test(value));
            }, "手机号不正确");
            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'validate-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    //客户信息
                    ProjectName: {
                        minlength: 2,
                        maxlength: 50,
                        required: true
                    },
                    ProjectMoney: {
                        number: true,
                        required: true,
                        min:1
                    },
                    ProjectCost: {
                        number: true,
                        required: true,
                        min:0
                    }, OrderTime: {
                        required: true
                    }, SchemeTime: {
                        required: true
                    },
                    //profile
                    ContractNO: {
                        maxlength: 20,
                        required: true
                    },
                    ProjectNO: {
                        maxlength: 20,
                        required: true
                    },
                    Handler: {
                        maxlength: 50,
                        required: true
                    },
                    ContactName: {
                        maxlength: 200,
                        required: true
                    },
                    Email: {
                        maxlength: 100,
                        required:true
                    },
                    Phone: {
                        maxlength: 100,
                        required: true
                    },
                    QQ: {
                        minlength: 8,
                        maxlength: 100
                    },
                    Weixin: {
                        maxlength: 40
                    },
                    ContactRrmark: {
                        maxlength:200
                    },
                    EndReason: {
                        maxlength: 500,
                        required: true
                    }
                },

                messages: { // custom messages for radio buttons and checkboxes
                    'payment[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.format("Please select at least one option")
                    }
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_gender_error");
                    } else if (element.attr("name") == "payment[]") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_payment_error");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavoir
                    }
                    var errors = $(".error", form);
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   
                    success.hide();
                    error.show();
                    App.scrollTo(error, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radip buttons, no need to show OK icon
                        label
                            .closest('.control-group').removeClass('error').addClass('success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid ok') // mark the current input as valid and display OK icon
                        .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                    }
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }

            });

            $("#btn_submit").click(function () {
                //form.submit();
                if (form.valid() == false) {
                    return false;
                }
                if (confirm("确认提交？")) {
                    document.getElementById("edit_form").submit();
                }

            });

        },
        getBaseUri: function () {
            var baseUri = document.URL || document.URI;
            baseUri = baseUri.substring(0, baseUri.indexOf("SalesOrder") + 11);
            return baseUri;
        },
        modifyProjectNOofDept: function (no) {
            var projectNo = no || $("#ProjectNO").val();
            if (projectNo) {
                return projectNo.replace("*", $("#CustomerNO").val());
            }
        }
    }
}();
var SalesCreate = function () {


    return {
        //main function to initiate the module
        init: function () {
            
            var $t = this;
            
            if (!jQuery().bootstrapWizard) {
                return;
            }

            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='assets/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }

            var form = $('#submit_form');
            var error = $('.alert-error', form);
            var success = $('.alert-success', form);

            $(".order-info").css("display", "none");

            //创建公司
            jQuery("#createCompany").change(function () {
                var $this = $(this).find("option:selected");
                var comName = $this.text();
                if ($(this).val() == 0) {
                    $("input[name='CustomerName']").val("");
                    $t.clearCustomerInfo();
                } else {

                    $(".control-cominfo").attr("readonly", "true");
                    $("select[name='Industry']").attr({ "disabled": "disabled" });
                    //根据id获取CustomerEntity实体
                    $t.bindCustomer($(this).val());
                }

                $("input[name='ContactID']").val(0);
                $("input[name='ContactName']").val("");
                $("input[name='Email']").val("");
                $("input[name='Phone']").val("");
                $("input[name='QQ']").val("");
                $("input[name='Weixin']").val("");
                $("textarea[name='ContactRemark']").text("");

                //重新生成项目编码，现在先不生成，等年底统一向财务和销售说完之后，再做自动生成
                //$t.getProjectNO();
            });
            

            //新建联系人
            jQuery("#createUserinfo").change(function () {
                var $this = $(this).find("option:selected");
                var comName = $this.text();
                if ($(this).val() == 0) {
                    $(".control-userinfo").removeAttr("readonly");
                    $("input[name='ContactID']").val(0);
                    $("input[name='ContactName']").val("");
                    $("input[name='Email']").val("");
                    $("input[name='Phone']").val("");
                    $("input[name='QQ']").val("");
                    $("input[name='Weixin']").val("");
                    $("textarea[name='ContactRemark']").text("");
                    //form.valid();
                } else {
                    $(".control-userinfo").attr("readonly", "true");
                    var contactId = $(this).val();
                    $.getJSON("GetContactEntityByID/" + $(this).val(), function (data) {
                        $("input[name='ContactID']").val(data.ContactID);
                        $("input[name='ContactName']").val(data.ContactName);
                        $("input[name='Email']").val(data.Email);
                        $("input[name='Phone']").val(data.Phone);
                        $("input[name='QQ']").val(data.QQ);
                        $("input[name='Weixin']").val(data.Weixin);
                        $("textarea[name='ContactRemark']").text(data.ContactRemark);
                        form.valid();
                    });
                }
            });

            $('.date-picker').datepicker({
                rtl: App.isRTL()
            });

            //根据销售单状态，显示/隐藏订单信息
            jQuery("#State").change(function () {
                if ($(this).val() == 3) {
                    $(".order-info").css("display", "block");
                    //if ($("#ProjectNO").val().length == 0) {
                    //    //获取项目编码
                    //    //$t.getProjectNO();
                    //}
                } else {
                    $(".order-info").css("display", "none");
                    //$("#ProjectNO").val("");
                }
                // 方案确认时间
                if ($(this).val() >=2) {
                    $(".SchemeTime").css("display","block")
                } else {

                    $(".SchemeTime").css("display", "none")
                }
                //alert($(this).val())
            });
            jQuery.validator.addMethod("isMobile", function (value, element) {
                var length = value.length;
                var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
                return this.optional(element) || (length == 11 && mobile.test(value));
            },"手机号不正确");
            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'validate-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    //客户信息
                    CustomerName: {
                        minlength: 2,
                        maxlength: 50,
                        required: true
                    },
                    CustomerNO: {
                        minlength: 2,
                        maxlength: 50,
                        required: true
                    },
                    Industry: {
                        required:true
                    },
                    CustomerAddress: {
                        minlength: 2,
                        maxlength: 100,
                        required: true
                    },
                    ContactName: {
                        maxlength: 200,
                        required: true
                    },
                    Email: {
                        maxlength: 100,
                        required: true
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
                    },
                    ProjectName: {
                        maxlength: 200,
                        required: true
                    },
                    Handler: {
                        maxlength: 50,
                        required: true
                    },
                    CustomerID: {
                        required:true
                    },
                    ProjectMoney: {
                        number: true,
                        required: true,
                        min:1
                    },
                    ProjectCost: {
                        number: true,
                        required: true,
                        min: 0
                    },
                    ContractNO: {
                        maxlength: 20,
                        required: true
                    }, ProjectNO: {
                        maxlength: 20,
                        required: true
                    }, OrderTime: {
                        required:true
                    },SchemeTime:{ // 方案确认时间
                        required:true
                    }
                },

                messages: { // custom messages for radio buttons and checkboxes
                    'payment[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.format("Please select at least one option")
                    },
                    Industry: {
                        required:"请选择行业"
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

            var displayConfirm = function() {
                $('.display-value', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
                    } else if ($(this).attr("data-display") == 'card_expiry') {
                        $(this).html($('[name="card_expiry_mm"]', form).val() + '/' + $('[name="card_expiry_yyyy"]', form).val());
                    } else if ($(this).attr("data-display") == 'payment') {
                        var payment = [];
                        $('[name="payment[]"]').each(function(){
                            payment.push($(this).attr('data-title'));
                        });
                        $(this).html(payment.join("<br>"));
                    }
                });
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index) {
                    //alert('on tab click disabled');
                    return false;
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    // 选择公司的时候，公司信息不能修改，其中行业是select，设置不能修改的话，只能用disabled属性
                    // 但是jQuery.Validation.js 中对控件的验证会排除具有disabled属性的控件
                    // 所以在验证之前需要先删除select的disabled属性， 验证完，不论成功与否，回复disabled属性（原来有的话，加上，没有的话，不处理）
                    $("select[name='Industry']").removeAttr("disabled");
                    if (form.valid() == false) {
                        if ($("select[name='Industry']").attr("readonly"))
                            $("select[name='Industry']").attr({ "disabled": "disabled" });
                        return false;
                    }
                    if ($("select[name='Industry']").attr("readonly"))
                        $("select[name='Industry']").attr({ "disabled": "disabled" });

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                        displayConfirm();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }
                    App.scrollTo($('.page-title'));
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }

                    App.scrollTo($('.page-title'));
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.bar').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').click(function () {
                //判断项目编码是否存在
                var projectNo = $("#ProjectNO").val();
                if (jQuery("#State").val() == "3") {
                    if ($("#ProjectNO").attr(""))
                    {
                        if (!(projectNo || projectNo.length > 0)) {
                            alert("项目编码不能为空")
                            return false;
                        }
                    }

                    $.ajax({
                        type: "post",
                        url: "CheckProjectNO",
                        cache: false,
                        dataType: "text",
                        data: { "ProjectNO": projectNo },
                        success: function (data) {

                            if (data == "False") {
                                if (confirm("确认添加？")) {
                                    document.getElementById("submit_form").submit();
                                }
                            } else {
                                alert("项目编码已存在，请修改后再提交");
                            }
                        }
                    });
                } else {
                    if (confirm("确认添加？")) {
                        document.getElementById("submit_form").submit();
                    }
                }

            }).hide();
            this.customerSearch();
            

        },
        getForm:function(){
            return $('#submit_form');
        },
        customerSearch: function () {
            var $this = this;
            $("#CustomerName").keyup(function () {
                $this.clearCustomerInfo();
                $this.showCustomers($(this));
            });

        },
        showCustomers: function (t) {
            var $t = this;
            var deptName = t.val();
            var $ShowCustomers = $("#ShowCustomers");
            if (deptName.length > 1) {
                //从服务器获取普通客户
                $.ajax({
                    url: "GetCommomCustomers",
                    type: "post",
                    cache: false,
                    dataType: "json",
                    data: { name: deptName },
                    success: function (data) {
                        $ShowCustomers.html("");
                        for (var i = 0; i < data.length; i++) {
                            var deptOption = "<p index=\"" + data[i].id + "\">" + data[i].name + "</p>";
                            $ShowCustomers.append($(deptOption).css("cursor","pointer"));
                        }
                        if (data.length > 0) {
                            $t.showCustomerList();
                        } else {
                            $t.clearCustomerList();
                        }
                        $ShowCustomers.find("p").each(function () {
                            $(this).click(function () {
                                    var id = $(this).attr("index");
                                    var name = $(this).html();
                                    $("#CustomerName").val(name);
                                    $("#CustomerID").val(id);
                                    $t.hiddenCustomerList();
                                    $t.bindCustomer(id);

                                    $(".control-cominfo").attr("readonly", "true");
                                    $("select[name='Industry']").attr({ "disabled": "disabled" });
                                    $("#CustomerName").removeAttr("readonly");
                                });
                        });
                    }
                });
            } else {
                this.hiddenCustomerList();
            }
        }, clearCustomerInfo: function () {

            $(".control-cominfo").removeAttr("readonly");

            $("select[name='Industry']").removeAttr("disabled");
            $("input[name='CustomerID']").val(0);
            $("input[name='CustomerAddress']").val("");
            $("input[name='CustomerNO']").val("");
            $("select[name='Industry']").find("option[value='']").attr("selected", true);
            $("textarea[name='CustomerRemark']").text("");
            //form.valid();
            this.bindContactDll();
        },
        clearCustomerList: function () {
            // 公司名称改变，模糊查询结果为空
            var $ShowCustomers = $("#ShowCustomers");
            this.hiddenCustomerList();
            $("#CustomerID").val("");
            $("#createUserinfo").html('<option value="0" selected>新建联系人</option>');
            $(".control-cominfo").removeAttr("readonly");
            $("select[name='Industry']").removeAttr("disabled");


        }, showCustomerList: function () {
            $("#ShowCustomers").css({ "display": "block" })
        }, hiddenCustomerList: function () {
            $("#ShowCustomers").css({ "display": "none" })
        },
        bindCustomer: function (id) {
            var $t = this;
            
            $.ajax({
                url: "GetCustomerEntityByID/" + id,
                type: "post",
                cache: false,
                dataType: "json",
                success: function (data) {

                    $("input[name='CustomerID']").val(data.CustomerID);
                    $("input[name='CustomerName']").val(data.CustomerName);
                    $("input[name='CustomerAddress']").val(data.CustomerAddress);
                    $("select[name='Industry']").find("option[value='" + data.Industry + "']").attr("selected", true);
                    $("input[name='CustomerNO']").val(data.CustomerNo);
                    $("textarea[name='CustomerRemark']").text(data.CustomerRemark);
                    //bindContactDll();

                    $("select[name='Industry']").removeAttr("disabled");
                    $t.getForm().valid();
                    if ($("select[name='Industry']").attr("readonly"))
                        $("select[name='Industry']").attr({ "disabled": "disabled" });

                    var contactDll = $("#createUserinfo");
                    contactDll.html("").append('<option value="0" selected>新建联系人</option>');
                    $(data.Contacts).each(function (index) {
                        contactDll.append('<option value="' + this.ContactID + '">' + this.ContactName + '</option>');
                        //$t.getForm().valid();
                    });

                    $("#ProjectNO").val($t.modifyProjectNOofDept());
                }
               
            });
        },bindContactDll:function() {
    var customerId = $("#CustomerID").val();
    var contactDll = $("#createUserinfo");
    contactDll.html("");
    contactDll.append('<option value="0" selected>新建联系人</option>');
    if (customerId == 0) {
        $("input[name='ContactID']").val(0);
        $("input[name='ContactName']").val("");
        $("input[name='Email']").val("");
        $("input[name='Phone']").val("");
        $("input[name='QQ']").val("");
        $("input[name='Weixin']").val("");
        $("textarea[name='ContactRrmark']").text("");
        return;
    }
},
        getProjectNO: function () {
            var $t = this;
            $.ajax({
                url: "GetProjectNO",
                cache: false,
                dataType: "json",
                type:"post",
                data: {},
                success: function (data) {
                    $("#ProjectNO").val($t.modifyProjectNOofDept( data));
                }
            });
        },
        modifyProjectNOofDept: function (no) {
            var projectNo = no || $("#ProjectNO").val();
            if (projectNo ) {
                return projectNo.replace("*",$("#CustomerNO").val()||'XX');
            }
        }

    };

}();
var Payment = function () {
    return {
        init: function () {

            var baseUri = document.URL || document.URI;
            baseUri = baseUri.substring(0, baseUri.indexOf("FinanceOrder") + 13);
            $("#ReceiptID").change(function () {

                var receiptID = $(this).val();
                $.getJSON(baseUri + "GetReceiptJson/" + receiptID, function (data) {
                    $("#ReceitpMoney").val(data.ReceitpMoney);
                    $("#ReceiptNO").val(data.ReceiptNO);
                    $("#CustomerID").val(data.CustomerID);
                });
            });

            $('.date-picker').datepicker({
                rtl: App.isRTL()
            });



            var form = $("#receipt-form");
            jQuery.validator.addMethod("notLessThan", function (value, element) {

                var noPaymentMoneySum =parseFloat( $("#noPaymentMoneySum").val());
                var paymentMoneySum = parseFloat($("#paymentMoneySum").val());
                return this.optional(element) || (noPaymentMoneySum >= paymentMoneySum);
            }, "收款金额不能大于未收款总金额");
            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'validate-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    ReceiptNO: {
                        required: true
                    },
                    ReceitpMoney: {
                        number: true,
                        required: true
                    },
                    PaymentTime: {
                        required: true
                    }, paymentMoneySum: {
                        required: true,
                        notLessThan: true,
                        min: 1
                    }, noPaymentMoneySum: {
                        required: true,
                        min: 1
                    }
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
                }

            });
            //$("#btn_Submit").click(function () {
            //    if (form.valid()) {
            //        if (confirm("确认收款？")) {
            //            form.submit();
            //        }
            //    }
            //});
        }
    };
}();
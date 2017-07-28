var DatePickerExpand = function () {

    return {
        //main function to initiate the module

        init: function (startTime,endTime) {
            //初始化日期选择控件
            $('#form-date-range').daterangepicker({
                ranges: {
                    '本月': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
                    '本季度': [this.getSeasonStartDate(), this.getSeasonStartDate().addMonths(3).addDays(-1)],
                    '本年': [Date.january().moveToFirstDayOfMonth(), Date.december().moveToLastDayOfMonth()]
                },
                opens: (App.isRTL() ? 'left' : 'right'),
                format: 'MM/dd/yyyy',
                separator: ' 至 ',
                startDate: startTime,
                endDate: endTime,
                locale: {
                    applyLabel: '确定',
                    fromLabel: '起始日期',
                    toLabel: '结束日期',
                    customRangeLabel: '自定义',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    firstDay: 1
                },
                showWeekNumbers: true,
                buttonClasses: ['btn-danger']
            },

            function (start, end) {
                $('#form-date-range span').html(start.toString('yyyy年M月d日') + ' - ' + end.toString('yyyy年M月d日'));
                $("#StartTime").val(start.toString('yyyy-M-d'));
                $("#EndTime").val(end.toString('yyyy-M-d'));
            });

            $('#form-date-range span').html(startTime.toString('yyyy年M月d日') + ' - ' + endTime.toString('yyyy年M月d日'));
        },
        getSeasonStartDate: function (date) {
            var tDate = date || Date.today();
            var seasonStartMonth = Math.floor((tDate.getMonth()) / 3) * 3;
            var nowYear = tDate.getYear();
            nowYear += (nowYear < 2000) ? 1900 : 0;
            var seasonStartDate = new Date(nowYear, seasonStartMonth, 1);
            return seasonStartDate;
        }
    };

}();
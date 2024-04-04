$(document).ready(function()
{
    if(calcRange == 'all')    recalculateAll(startDate, endDate);
    if(calcRange == 'single') recalculateSingle(code, dateType, startDate, endDate);
});

function recalculateAll(startDate, endDate)
{
    var dateRange = getDateRange(startDate, endDate);

    var calcLink = $.createLink('metric', 'ajaxSaveCalculatedMetrics');
    $.get(calcLink, function(result){
        updateAllHistory(dateRange);
    });

    function updateAllHistory(dateRange, index = 0)
    {
        if(index >= dateRange.length) 
        {
            var deduplication = $.createLink('metric', 'ajaxDeduplicateRecord');
            $.get(deduplication, function(result)
            {
                displayExitButton();
                hideRecalculateNotice();
            });
            return;
        }
        
        var date = dateToString(dateRange[index]);
        var $html = recalculateLog(date);

        var link = $.createLink('metric', 'ajaxUpdateHistoryMetricLib', 'date=' + date + '&calcType=' + calcType);
        $.get(link, function(result){
            $('.recalculate-log').append($html);
            updateAllHistory(dateRange, index + 1);
        });
    }
}

function recalculateSingle(code, dateType, startDate, endDate)
{
    var dateRange = getDateRange(startDate, endDate, dateType);
    updateSingleHistory(dateRange);
    function updateSingleHistory(dateRange, index = 0)
    {
        if(index >= dateRange.length) 
        {
            var deduplication = $.createLink('metric', 'ajaxDeduplicateRecord');
            $.get(deduplication, function(result)
            {
                displayExitButton();
                hideRecalculateNotice();
            });
            return;
        }

        var date = dateToString(dateRange[index]);
        var $html = recalculateLog(date);

        var link = $.createLink('metric', 'ajaxUpdateSingleMetricLib', 'code=' + code + '&date=' + date);
        $.get(link, function(result){
            $('.recalculate-log').append($html);
            updateSingleHistory(dateRange, index + 1);
        });
    }
}

function recalculateLog(date)
{
    var dateStr = date.split('_').join('-');

    var html = '<p class="recalculate-sentence-pass">';
    html += recalculateLogText.replace('%s', dateStr);
    html += '  <i class="icon icon-check success"></i>';
    html += '</p>';

    var logContainer = document.getElementById('recalculate-log');
    logContainer.scrollTop = logContainer.scrollHeight;

    return html;
}

function getDateRange(startDate, endDate, dateType = 'day')
{
    var start = new Date(startDate);
    var end   = new Date(endDate);

    var dateRange = [];

    if(dateType == 'day')
    {
        while(start <= end) 
        {
            dateRange.push(new Date(start));
            start.setDate(start.getDate() + 1);
        }
    }

    if(dateType == 'month')
    {
        start.setDate(1);
        while(start <= end) 
        {
            var nextMonth = new Date(start.getFullYear(), start.getMonth() + 1, 1);
            var lastDayOfMonth = new Date(nextMonth - 1);
            dateRange.push(lastDayOfMonth);

            start = nextMonth;
        }
        dateRange.pop();
        dateRange.push(end);
    }

    if(dateType == 'year')
    {
        startYear = start.getFullYear();
        endYear   = end.getFullYear();

        for(let year = startYear; year <= endYear; year++)
        {
            var lastDayOfYear = year + '-12-31';
            dateRange.push(new Date(lastDayOfYear));
        }
        dateRange.pop();
        dateRange.push(end);
    }

    return dateRange;
}

function dateToString(date)
{
    var year  = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day   = date.getDate().toString().padStart(2, '0');

    return year + '_' + month + '_' + day;
}

function displayExitButton()
{
    $('.exit').removeClass('hidden');
}

function hideRecalculateNotice()
{
    $('.notice-recalculate').css('visibility', 'hidden');
}

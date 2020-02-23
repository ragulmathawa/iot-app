
function flattenStats(stats,from,to){
    let flatArray = [];
    stats.forEach(hourStat=>{
        Object.keys(hourStat.values).forEach(minuteStr=>{
            let minute = parseInt(minuteStr);
            Object.keys(hourStat.values[minuteStr]).forEach(secondStr=>{
                let second = parseInt(secondStr);
                let date = new Date(hourStat.timestamp_hour);
                date.setMinutes(minute,second);
                let timestamp = date.getTime();
                if(timestamp>=from&& timestamp<=to){
                    flatArray.push({
                        "timestamp":timestamp,
                        "value":hourStat.values[minuteStr][secondStr]
                    });
                }
            })
        })
    })
    return flatArray;
}
module.exports = {
    flattenStats
}
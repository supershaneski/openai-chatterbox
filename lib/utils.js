export function formatNumber(n) {
    return n < 10 ? '0' + n : n
}

export function formatData(data) {

    /*let txts = data.split("\n").filter(item => item.length > 0).filter(item => item.indexOf('[') === 0).map(item => {
        let n = item.indexOf(']')
        return item.substr(n + 1).trim()
    })*/

    let txts = data.split("\n").filter(item => item.length > 0).filter(item => item.indexOf('[') === 0)

    //return txts.length > 0 ? txts.join(' ') : ''

    return txts //array
    
}

export function getSimpleId() {
    return Math.random().toString(26).slice(2);
}

export function getDisplayDateTime(strDateTime) {

    const odate = new Date(strDateTime)

    const syear = odate.getFullYear()
    let smonth = odate.getMonth() + 1
    let sdate = odate.getDate()

    smonth = formatNumber(smonth)
    sdate = formatNumber(sdate)

    let shour = odate.getHours()
    let smins = odate.getMinutes()
    let secs = odate.getSeconds()

    shour = formatNumber(shour)
    smins = formatNumber(smins)
    secs = formatNumber(secs)

    return [[syear, smonth, sdate].join("-"),[shour,smins,secs].join(":")].join(" ")

}
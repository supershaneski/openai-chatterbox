export function formatNumber(n) {
    return n < 10 ? '0' + n : n
}

export function formatData(data) {

    return data.split("\n").filter(item => item.length > 0).filter(item => item.indexOf('[') === 0)
    
}

export function formatData2(data) {

    const tokens = data.split("\n").filter(item => item.length > 0)

    let flag = false
    let txts = []
    let n = 0

    for(let i = 0; i < tokens.length; i++) {
        
        if(tokens[i].indexOf('-->') >= 0) {

            flag = true

            const stokens = tokens[i].split('-->')
            const t0 = stokens[0].trim().substr(3).replace(',', '.')
            const t1 = stokens[0].trim().substr(3).replace(',', '.')

            n = txts.push(`[${t0} --> ${t1}]`)

        } else {
            if(flag) {
                txts[n - 1] += ' ' + tokens[i].trim()
            }
        }
    }

    return txts
    
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
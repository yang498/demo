const https = require('https')

https.request({
    url: 'https://jetta.faw-vw.com/jetta/index.php?act=dealerservice&op=querydealerinfo',
    method: 'post',
}, res => {
    let data = ''
    res.setEncoding('utf8')
    res.on('data', dataItem => data += dataItem)
    res.on('end', () => {
        console.log(data)
    })
})
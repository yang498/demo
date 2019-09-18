const https = require('https')
const fs = require('fs')
const iconv = require('iconv-lite')
const { Connection, Request } = require('tedious')
const { log } = console

// 获取 json
const get = (url, call) => https.get('https://api.m.renrenck.cn' + url, res => {
    let data = ''
    res.setEncoding('utf8')
    res.on('data', dataItem => data += dataItem)
    res.on('end', () => call(JSON.parse(data).data))
})

// 获取网页（需转码）
const getWeb = (url, call) => https.get(url, res => {
    const data = []
    res.on('data', dataItem => data.push(dataItem))
    res.on('end', () => call(iconv.decode(Buffer.concat(data), 'utf8').toString())) // utf8、gbk、gb2312、CP936
})

// 根据车系获取颜色
let outsideArrAll = [] // 外色，每项形如 [1, 2, 3, '黑色', '#000000']
let insideArrAll = [] // 内色，每项形如同外色
let dataArr = [] // 数据库车系 id
let i = 0 // dataArr 当前 index
const timeStart = Date.now() // 开始时间
const getColor = SerieID => getWeb(`https://car.autohome.com.cn/config/series/${SerieID}.html`, colorData => {
    // 抓取当前车系颜色数据
    const outsideRes = colorData.match(/(?<=var color =).+?(?=;\n)/)
    const insideRes = colorData.match(/(?<=var innerColor =).+?(?=;\n)/)
    if (outsideRes) {
        const outside = JSON.parse(outsideRes[0]).result.specitems
        if (outside.length) {
            const outsideArr = []
            outside.forEach(items => items.coloritems.forEach(item => outsideArr.push([SerieID, items.specid, item.id, item.name, item.value])))
            outsideArrAll = outsideArrAll.concat(outsideArr)
        }
    }
    if (insideRes) {
        const inside = JSON.parse(insideRes[0]).result.specitems
        if (inside.length) {
            const insideArr = []
            inside.forEach(items => items.coloritems.forEach(item => insideArr.push([SerieID, items.specid, item.id, item.name, item.value])))
            insideArrAll = insideArrAll.concat(insideArr)
        }
    }
    // 循环抓取，直到最后导出
    if (i < dataArr.length) {
        i++
        getColor(dataArr[i])
        log(i + '/' + dataArr.length)
    } else {
        // 最大执行 1000 行，所以每 1000 行分隔语句
        const split1000 = arr => {
            const arr1000 = []
            arr.forEach((item, index) => {
                if (!/\./g.test(index / 1000 + '')) arr.push([])
                arr1000[arr1000.length - 1].push(item)
            })
            return arr1000
        }
        // 拼合语句
        let insertOut = split1000(outsideArrAll).map(item => {
            return 'insert into ck_tmp_outside_color values ' + 
                outsideArrAll.map(item => `(${item[0]}, ${item[1]}, ${item[2]}, '${item[3]}', '${item[4]}')`).join(',\n')
        }).join('\n')
        let insertIn = split1000(outsideArrAll).map(item => {
            return 'insert into ck_tmp_inside_color values ' + 
                insideArrAll.map(item => `(${item[0]}, ${item[1]}, ${item[2]}, '${item[3]}', '${item[4]}')`).join(',\n')
        }).join('\n')

        // 执行语句
        // connection.execSql(new Request(insertOut, (err, rowCount) => log(err || `外色插入 ${rowCount} 行`)))
        // connection.execSql(new Request(insertIn, (err, rowCount) => log(err || `内色插入 ${rowCount} 行`)))

        // 用时
        const time = new Date(Date.now() - timeStart)
        log(`用时${time.getMinutes()}分${time.getSeconds()}秒`)

        // 导出文件备份
        fs.writeFile('outColor.sql', insertOut, 'utf8', err => log(err || 'outColor.sql 生成成功:)'))
        fs.writeFile('inColor.sql', insertIn, 'utf8', err => log(err || 'inColor.sql 生成成功:)'))
    }
})

// 连接数据库
const connection = new Connection({
    server: '120.79.36.232',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: 'dsa.q.tla2018'
        }
    },
    options: {
        database: 'RRCK',
        rowCollectionOnRequestCompletion: true
    }
})
// 查询数据
connection.on('connect', err => {
    if (err) {
        log({ message: err.message, code: err.code })
    } else {
        log('登录成功')
        const sql = 'select id from ck_car_serie_final where ishaltsale = 0'
        const request = new Request(sql, (err, rowCount, rows) => {
            if (err) {
                log(err)
            } else {
                log(`${rowCount} 行`)
                dataArr = rows.map(items => items.map(item => item.value)[0])
                getColor(dataArr[0])
            }
            connection.close()
        })
        connection.execSql(request)
    }
})

// 忘了分隔 1000 行
// const outC = fs.readFileSync('outColor_tmp.sql', 'utf8').split('\n').map((item, index) => {
//     item = /\./g.test((index + 1) / 1000 + '') ? item : item.slice(0, -1)
//     return index && /\./g.test(index / 1000 + '') ? item : 'insert into ck_tmp_outside_color values ' + item
// }).join('\n')
// const inC = fs.readFileSync('inColor_tmp.sql', 'utf8').split('\n').map((item, index) => {
//     item = /\./g.test((index + 1) / 1000 + '') ? item : item.slice(0, -1)
//     return index && /\./g.test(index / 1000 + '') ? item : 'insert into ck_tmp_inside_color values ' + item
// }).join('\n')
// fs.writeFile('outColor.sql', outC, 'utf8', err => log(err || 'outColor.sql 生成成功:)'))
// fs.writeFile('inColor.sql', inC, 'utf8', err => log(err || 'inColor.sql 生成成功:)'))
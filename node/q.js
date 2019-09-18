// 搭建服务、接收请求、转换数据、存储更改数据（连接 SQL / MongoDB）
const http = require('http')
const fs = require('fs')
const qs = require('querystring')
const cp = require('child_process')
const { log } = console
const host = 'localhost'
const port = 1000

// 接收网页提交的数据和文件，返回对应的值
http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' })
	res.end('hello')
}).listen(port, host, () => {
	log(`Server running at http://${host}:${port}/`)
	cp.exec(`start http://${host}:${port}/`)
})

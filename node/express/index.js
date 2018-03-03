const querystring = require('querystring')
const fs = require('fs')
const express = require('express')
const app = express()

// 指定localhost:3000为当前目录的index文件夹，可以加载相对路径资源，默认打开index.html
app.use(express.static(__dirname + '/index'))
app.listen('3000')
console.log('server running!')

app.post('/success', (req, res) => {
	var dataStr = ''
	var dataJson = {}

	req.on('data', data => {
		dataStr += data
		dataJson = querystring.parse(dataStr)
	});
	req.on('end', () => {
		fs.readFile('index/success.html', 'utf8', (err, data) => {
			data = data.replace(/#\{[^]*?\}/g, item => {
				if(item == '#{name}') {
					return dataJson.name
				} else if(item == '#{phone}') {
					return dataJson.phone
				} else {
					return item
				}
			})
			res.send(data)
		})
	})
})
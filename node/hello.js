var http = require('http') // 引入http模块
var url = require('url') // 引入url模块
http.createServer(function(request, response) { // 创建服务器
	// 参数request用来处理http请求的细节，response用来响应请求做点什么
	// 向服务器发出请求（在浏览器访问localhost:3000或刷新）时触发
	console.log('coming') // 输出第二次是读取localhost:3000/favicon.ico
	console.log(url.parse(request.url).href) // 输入浏览器请求的URL路径
	response.writeHead(200, { "Content-Type": "text/plain" }) // 当收到请求时发送一个http状态200(ok)和http头的内容类型
	response.write("Hello World") // 在页面输出 Hello World
	response.end() // 完成响应
}).listen(3000) // 启动监听3000端口的服务器
console.log('server running!') // 提示服务已开启

//var server = http.createServer()
//server.on('request', function(req, res){
//	res.writeHead(200, {'Content-Type':'text/plain'})
//  res.end('hello world')
//}).listen('3000')
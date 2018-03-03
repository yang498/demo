const fs = require("fs")
const linkReg = /<link\srel="import"\shref="(.*)"\/>/g

const filename = 'index.html'
const importReplace = filename => {
	// 读取文件
	fs.readFile(filename, 'utf8', (err, data) => {
		// 把<link>替换成href指定的文件内容，m1为匹配的路径地址，返回对应内容
		let dataReplace = data.replace(linkReg, (matchs, m1) => fs.readFileSync(m1, 'utf-8'))

		// 生成新的HTML文件
		fs.writeFile(filename, dataReplace, 'utf8', err => {
			console.log(filename + '替换成功！')
		})
	})
}

importReplace(filename);

// 监控文件变更后重新生成
//setTimeout(() => {
//	fs.watch(filename, (event, filename) => {
//		if(event === 'change') {
//			console.log(filename + '发生了改变，重新生成...')
//			importReplace(filename)
//		}
//	})
//}, 1000)
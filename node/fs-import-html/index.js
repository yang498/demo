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

//importReplace(filename);

// 监控文件变更后重新生成
//setTimeout(() => {
//	fs.watch(filename, (event, filename) => {
//		if(event === 'change') {
//			console.log(filename + '发生了改变，重新生成...')
//			importReplace(filename)
//		}
//	})
//}, 1000)

var path = require('path')

//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.resolve('E:\rrck\源码\人人车库项目源码(全)\renrenck-android(安卓)\renrenck-android')

//调用文件遍历方法
fileDisplay(filePath)

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror,stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            console.log(filedir);
                        }
                        if(isDir){
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}
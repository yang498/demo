const month30 = [4, 6, 9, 11]
const month31 = [1, 3, 5, 7, 8, 10, 12]
const week = ['日', '一', '二', '三', '四', '五', '六']
// 合并所有月的数据
let nowMonth = 0
let dataNameE = []
let dataNameS = []
let dataNameW = []
let dataNameN = []
let dataNameA = []
let dataNameF = []
for(let i = 1; i <= data.lastMonth; i++) {
	dataNameE.push('east' + i)
	dataNameS.push('south' + i)
	dataNameW.push('west' + i)
	dataNameN.push('north' + i)
	dataNameA.push('allFriend' + i)
	dataNameF.push('fail' + i)
}
for(let i = 0; i < 32; i++) {	// 如果这一天的数据不存在则跳过到下个月
	if(!data[dataNameE[nowMonth]][i]){
		if(nowMonth === dataNameE.length - 1) break	// 如果又是最后一个月则终止循环
		i = -1
		nowMonth++
		continue
	}
	data.east.push(data[dataNameE[nowMonth]][i]) // 因为需要有跳过的需求，所以有一个作为循环，需要加入字符串，也就多一天，在建立xDate的时候加完日期删掉
	if(!isNaN(data[dataNameE[nowMonth]][i])){	// 如果这一天是个字符串则跳过这天
		data.south.push(data[dataNameS[nowMonth]][i])
		data.west.push(data[dataNameW[nowMonth]][i])
		data.north.push(data[dataNameN[nowMonth]][i])
		data.allFriend.push(data[dataNameA[nowMonth]][i])
		data.fail.push(data[dataNameF[nowMonth]][i])
		data.all.push(data[dataNameE[nowMonth]][i] + data[dataNameS[nowMonth]][i] + data[dataNameW[nowMonth]][i] + data[dataNameN[nowMonth]][i])
	}
}
// 建立折线图x轴的日期，初始为data的起始日期
let xDate = [data.startDate.slice(5)]
let month = data.startDate[5] - 0	// 起始月份，1月是个字符串
let today = data.startDate.slice(-2)	// 日期
const day = data.all.length - 1	// 所有天数，标题会用到
for(let i = 1; i <= day; i++) {
	if((month31.indexOf(month) > -1 && today > 31) || (month30.indexOf(month) > -1 && today > 30) || (month == 2 && today >= 28)) {
		month++
		today = 0
	}
	if(isNaN(data.east[i])) {	// 如果东这一天是个字符串则跳到指定的逗号后面的天数并删掉自己，否则就++
		today = data.east[i].replace(/\d*,/, '')
		data.east.splice(i, 1)
	} else {
		today = today - 0 + 1
	}
	xDate.push(month + '/' + today)
}
// 2/2号开始建立南北2区，加上1区人数，如果再建立3区再加上2区人数----------------------------------------
for(let i = data.east1.length + 1; i < data.east.length; i++) {
	data.south[i] += data.lastSouth1
	data.north[i] += data.lastNorth1
	data.all[i] += data.lastSouth1 + data.lastNorth1
}

// excel数据--------------------------------------------------------------------------------------------------------------------
let excelPro = []	// 省份，用于判断name，不存在就创建，存在就+1
let excelCity = []	// 城市
let excelKind = []	// 公司性质
let excelPost = []	// 职位
let excelProData = []	// 省份和对应的值
let excelCityData = []	// 城市和对应的值
let excelKindData = []	// 公司性质和对应的值
let excelPostData = []	// 职位和对应的值
excel.split('\n').forEach((item, index) => {
	let res = item.split(',')
	if(res[0] && res[1] && res[3] && res[5]){
		// 省
		if(excelPro.indexOf(res[0]) < 0){
			excelPro.push(res[0])
			excelProData.push({name:res[0],value:1})
		} else {
			excelProData[excelPro.indexOf(res[0])].value++
		}
		// 市
		let city = /北京|天津|上海|重庆/.test(res[0]) ? res[0] : res[1]
		if(excelCity.indexOf(city) < 0){
			excelCity.push(city)
			excelCityData.push({name:city,value:1})
		} else {
			excelCityData[excelCity.indexOf(city)].value++
		}
		// 公司性质
		if(excelKind.indexOf(res[3]) < 0){
			excelKind.push(res[3])
			excelKindData.push({name:res[3],value:1})
		} else {
			excelKindData[excelKind.indexOf(res[3])].value++
		}
		// 职位
		if(excelPost.indexOf(res[5]) < 0){
			excelPost.push(res[5])
			excelPostData.push({name:res[5],value:1})
		} else {
			excelPostData[excelPost.indexOf(res[5])].value++
		}
	}
})
// 数据合并为每项格式为{name:'城市',value:[lng经度, lat纬度, value]}
let mapCityLngLatVal = []
for(let item of excelProData) /北京|天津|上海|重庆/.test(item.name) && mapCityLngLatVal.push({ name: item.name, value: mapCityLngLat[item.name].concat(item.value) })
for(let item of excelCityData) mapCityLngLat[item.name] && mapCityLngLatVal.push({ name: item.name, value: mapCityLngLat[item.name].concat(item.value) })
// 各数据排序
excelProData.sort((a,b) => b.value - a.value)
excelCityData.sort((a,b) => b.value - a.value)
excelKindData.sort((a,b) => b.value - a.value)
excelPostData.sort((a,b) => b.value - a.value)
// 省市柱形图需要的X轴数据
let excelProName = []
let excelCityName = []
for(let item of excelProData) excelProName.push(item.name)
for(let item of excelCityData) excelCityName.push(item.name)
// 省人数柱形图分东南西北
const proEast = ['安徽', '江苏', '上海', '浙江']
const proSouth = ['福建', '广东', '广西', '海南', '湖南', '江西']
const proWest = ['重庆', '甘肃', '贵州', '湖北', '宁夏', '青海', '陕西', '四川', '新疆', '西藏', '云南']
const proNorth = ['北京', '河北', '河南', '黑龙江', '吉林', '辽宁', '内蒙古', '山东', '山西', '天津']
let proEastData = []
let proSouthData = []
let proWestData = []
let proNorthData = []
for(let item of excelProData) {
	proEastData.push(proEast.indexOf(item.name) < 0 ? {name: item.name} : item)
	proSouthData.push(proSouth.indexOf(item.name) < 0 ? {name: item.name} : item)
	proWestData.push(proWest.indexOf(item.name) < 0 ? {name: item.name} : item)
	proNorthData.push(proNorth.indexOf(item.name) < 0 ? {name: item.name} : item)
}
// 职位饼图低于5个人就人数相同的合在一起
let excelPostFirst = []
let excelPostIndex = 1	// 每10个换行
for(let i = 0; i < excelPostData.length; i++) {
	if(excelPostData[i].value < 5) {
		// 给第一次匹配到的存起来，excelPostData[i].value就是index，i就是value
		// 之后的把name和value放到第一次匹配的里面，用逗号隔开，并把这个元素删掉
		if(excelPostFirst[excelPostData[i].value - 1]) {
			let nameSplit = '、'
			if(excelPostData[i].value === 1 || excelPostData[i].value === 2) {
				excelPostIndex === 8 ? (excelPostIndex = 1) : (excelPostIndex++)
				excelPostIndex === 8 && (nameSplit = '\n')
			}
			excelPostData[excelPostFirst[excelPostData[i].value - 1]].name += nameSplit + excelPostData[i].name
			excelPostData[excelPostFirst[excelPostData[i].value - 1]].value += excelPostData[i].value
			excelPostData.splice(i, 1)
			i--
		} else {
			excelPostFirst[excelPostData[i].value - 1] = i
			excelPostData[i].name = (excelPostData[i].value === 1 ? '\n\n\n' : '') + excelPostData[i].value + '人集合：' + excelPostData[i].name
		}
	}
}

// 东西南北测试数据
let proESWNTest = []
for(let item of proEast) proESWNTest.push({ name: item, value: 0 })
for(let item of proSouth) proESWNTest.push({ name: item, value: 50 })
for(let item of proWest) proESWNTest.push({ name: item, value: 100 })
for(let item of proNorth) proESWNTest.push({ name: item, value: 150 })
var data = {	// 有个bug，当增加到下一年又该怎样----------------------------------------
	startDate: '2018/1/14',
	east: [], south: [], west: [], north: [], all: [], allFriend: [], fail: [],
	lastSouth1: 422, lastNorth1: 446,
	// 2018年1月
	east1     : [  79,  96, 106, 127, 137, 142, 148, 148, 150, 151, 160, 163, 171, 178, 186, 195, 199, 208],
	south1    : [ 148, 187, 215, 252, 297, 309, 312, 314, 318, 329, 348, 351, 368, 376, 387, 398, 402, 415],
	west1     : [  66, 113, 122, 133, 140, 144, 146, 146, 152, 155, 159, 164, 165, 165, 166, 171, 173, 179],
	north1    : [ 130, 188, 195, 240, 271, 281, 294, 297, 304, 312, 333, 342, 376, 387, 397, 417, 430, 443],
	allFriend1: [ 968,1334,1850,1900,2187,2242,2280,2288,2307,2357,2495,2524,2656,2700,2836,2892,2944,3064],
	fail1     : [  20,  30,  63,  85, 105, 112, 119, 121, 127, 135, 148, 158, 186, 190, 191, 202, 223, 230],
	// 2018年2月
	east2     : [ 222, 224, 226, 226, 226, 225, 225, 227, '08,25',  224, 226, 224, 223],
	south2    : [ 430,  32,  35,  36,  40,  42,  45,  45, '08,25',   49,  49,  51,  50],
	west2     : [ 188, 189, 189, 189, 190, 193, 194, 195, '08,25',  197, 197, 196, 195],
	north2    : [ 460,  28,  31,  31,  33,  35,  36,  36, '08,25',   38,  38,  38,  37],
	allFriend2: [3174,3196,3205,3212,3217,3225,3230,3233, '08,25', 3248,3251,3257,3260],
	fail2     : [ 241, 252, 254, 255, 256, 258, 260, 260, '08,25',  263, 263, 263, 263],
	// 2018年3月
	east3     : [ 223, 223, 225],
	south3    : [  51,  51,  52],
	west3     : [ 195, 195, 196],
	north3    : [  39,  41,  42],
	allFriend3: [3258,3260,3265],
	fail3     : [ 262, 261, 261],
	// 每加1个月加1----------------------------------------
	lastMonth : 3
}
const month30 = [4,6,9,11]
const month31 = [1,3,5,7,8,10,12]
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
	data.east.push(data[dataNameE[nowMonth]][i])	// 如果只有东push了字符串那就多一天，在建立xDate的时候删掉
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
let month = data.startDate[5]	// 起始月份
let today = data.startDate.slice(-2) - 0	// 日期
const day = data.all.length - 1	// 所有天数
for(let i = 1; i <= day; i++) {
	today = isNaN(data.east[i]) ? data.east[i].replace(/\d*,/, '') : today - 0 + 1	// 如果这一天是个字符串则跳到指定的天数
	xDate.push(month + '/' + today)
	if((month31.indexOf(month) && today > 31) || (month30.indexOf(month) && today > 30) || (month == 2 && today >= 28)) {
		month++
		today = 0
	}
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
		// 市，不包括直辖市的区
		if(!/北京|天津|上海|重庆/.test(res[0])){
			if(excelCity.indexOf(res[1]) < 0){
				excelCity.push(res[1])
				excelCityData.push({name:res[1],value:1})
			} else {
				excelCityData[excelCity.indexOf(res[1])].value++
			}
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
// 省人数柱形图分东南西北，青海和西藏暂时没人
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
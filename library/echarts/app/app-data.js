// 去掉带有省直辖开头的，将英文逗号改成中文逗号
var proData = []
var proDataExcel = []
var cityData = []
var cityDataExcel = []
app.split('\n').forEach(function(obj, index){
	var item = obj.split(',')
	var proItem = item[5].replace(/省/, '')
	var cityItem = item[6].replace(/市/, '')
	proItem.indexOf('区') > -1 && (proItem = proItem.slice(0, 2))
	proItem === '内蒙' && (proItem = '内蒙古')
	// 省
	if(proData.indexOf(proItem) < 0){
		proData.push(proItem)
		proDataExcel.push({name:proItem, value:1})
	} else {
		proDataExcel[proData.indexOf(proItem)].value++
	}
	// 市
	var city = /北京|天津|上海|重庆/.test(proItem) ? proItem : item[6]
	if(cityData.indexOf(city) < 0){
		cityData.push(city)
		cityDataExcel.push({name:city,value:1})
	} else {
		cityDataExcel[cityData.indexOf(city)].value++
	}
})
proDataExcel.sort(function(a, b){ return b.value - a.value })
var proName = []
var cityName = []
for(var item of proDataExcel) proName.push(item.name)
for(var item of cityDataExcel) cityName.push(item.name)
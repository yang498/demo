// 初始化右侧导航nav内容
$('.normal').each(function(){
	$('.nav')[0].innerHTML += '<li><i class="iconfont icon-' + $(this).data('icon') + '"></i>' + $(this).text() + '</li>'
})

// 各区域人数旭日图
echarts.init(document.getElementById('area')).setOption({
	title: {
		text: '数据截止 2018/' + xDate[day] + ' 星期' + week[new Date('2018/' + xDate[day]).getDay()]+ '\n\n各区群总人数：' + data.all[day],
		textStyle: { fontSize: 24 },
		left: 'center',
		top: 20
	},
	tooltip: {},	// 颜色不高亮？？
	color: ['#0c0', '#08f', '#f90', '#f30'],
	series: [
		{
			type: 'sunburst',
			sort: null,
			startAngle: 30,
			nodeClick: false,
			radius: [0, '35%'],
			center: ['50%', '56%'],
			label: { show: false },
			itemStyle: { borderWidth: 0 },
			data: [
				{ name: '东', value: data.east[day] },
				{ name: '南', value: data.south[day] },
				{ name: '西', value: data.west[day] },
				{ name: '北', value: data.north[day] }
			],
			z: -1
		},
		{
			type: 'sunburst',
			label: {
				rotate: 0,
				fontSize: 16,
				formatter: res => {
					let val = /南一|南二|北一|北二/.test(res.name) ? res.treePathInfo[1].value : res.treePathInfo[0].value
					return res.name + '：' + res.value + '\n' + (res.value / val * 100).toFixed(2) + '%'
				}
			},
			sort: null,
			startAngle: 30,
			nodeClick: false,
			radius: ['20%', '70%'],
			center: ['50%', '56%'],
			itemStyle: { borderWidth: 0 },
			data: [
				{
					name: '东', value: data.east[day],
					children: [{ name: '东', value: data.east[day], label: { show: false }, itemStyle: { borderWidth: 1 } }]
				},
				{
					name: '南',
					children: [
						{ name: '南一', value: data.lastSouth1, itemStyle: { borderWidth: 1 } },
						{ name: '南二', value: data.south[day] - data.lastSouth1, itemStyle: { color: '#0cc', borderWidth: 1 } },
					]
				},
				{
					name: '西', value: data.west[day],
					children: [{ name: '西', value: data.west[day], label: { show: false }, itemStyle: { borderWidth: 1 } }]
				},
				{
					name: '北',
					children: [
						{ name: '北一', value: data.lastNorth1, itemStyle: { borderWidth: 1 } },
						{ name: '北二', value: data.north[day] - data.lastNorth1, itemStyle: { color: '#f08', borderWidth: 1 } }
					]
				}
			]
		}
	]
})

// 趋势折线图
echarts.init(document.getElementById('line')).setOption({
	dataZoom: {
		type: 'slider',
		startValue: data.allFriend.length - 20,
		endValue: data.allFriend.length - 1
	},
	grid: {
		width: '90%',
		left: '5%'
	},
	title: {
		text: '蓝色联盟',
		subtext: '括号内的数据是相对于前一天的增加量\n默认显示最近20天的数据，控制下方滑杆可移动缩放',
		left: 'center',
		textStyle: { fontSize: 24 },
		subtextStyle: {
			fontSize: 16,
			color: '#fff',
			textShadowColor: '#666',
			textShadowOffsetX: 360,
			textShadowOffsetY: -32
		},
		z: -1
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
			shadowStyle: { color: 'rgba(0,0,0,0.05)' }
		}
	},
	legend: {
		top: 5,
		left: 100,
		textStyle: { fontSize: 18 },
		data: ['总好友', '群总人数', '审核不通过']
	},
	xAxis: {
		data: xDate,
		boundaryGap: false
	},
	yAxis: {},
	series: [
		{
			type: 'line',
			name: '总好友',
			symbolSize: 14,
			label: {  show: true, fontSize: 14, color: '#000' },
			itemStyle: { color: '#0c0' },
			emphasis: {
				symbolSize: 16,
				label: {
					show: true,
					fontSize: 16,
					formatter: res => {
						let dif = ''
						if(res.dataIndex){
							const result = data.allFriend[res.dataIndex] - data.allFriend[res.dataIndex - 1]
							dif = '{allF| (' + (result > 0 ? '+' + result : result) + ')}'
						}
						return res.data + dif
					},
					rich: { allF: { color: '#0c0' } }
				}
			},
			data: data.allFriend
		},
		{
			type: 'line',
			name: '群总人数',
			symbolSize: 14,
			label: {  show: true, fontSize: 14, color: '#000' },
			itemStyle: { color: '#08f' },
			emphasis: {
				symbolSize: 16,
				label: {
					show: true,
					fontSize: 16,
					formatter: res => {
						let dif = ''
						if(res.dataIndex){
							const result = data.all[res.dataIndex] - data.all[res.dataIndex - 1]
							dif = '{all| (' + (result > 0 ? '+' + result : result) + ')}'
						}
						return res.data + dif
					},
					rich: { all: { color: '#08f' } }
				}
			},
			data: data.all
		},
		{
			type: 'line',
			name: '审核不通过',
			symbolSize: 14,
			label: { show: true, fontSize: 14, color: '#000' },
			itemStyle: { color: '#f80' },
			emphasis: {
				symbolSize: 16,
				label: {
					show: true,
					fontSize: 16,
					formatter:res => {
						let dif = ''
						if(res.dataIndex){
							const result = data.fail[res.dataIndex] - data.fail[res.dataIndex - 1]
							dif = '{fail| (' + (result > 0 ? '+' + result : result) + ')}'
						}
						return res.data + dif
					},
					rich: { fail: { color: '#f80' } }
				}
			},
			data: data.fail
		}
	]
})

// 公司性质饼图
echarts.init(document.getElementById('kind')).setOption({
	title: {
		text: '以上数据每日更新\n以下数据每周更新\n\n公司性质',
		left: 'center',
		textStyle: { fontSize: 24 }
	},
	legend: {
		top: 'center',
		left: 150,
		orient: 'vertical',
		textStyle: { fontSize: 20 }
	},
	tooltip: { formatter: '{b}：{c}人 <br/> {d}%' },
	series: {
			type: 'pie',
			startAngle: 0,
			center: ['50%', '60%'],
			label: { formatter: '{b}：{c}\n{d}%', fontSize: 16 },
			color: ['#f30', '#f90', '#fc0', '#0c0', '#0cc', '#08f', '#80f', '#f08'],
			data: excelKindData
	}
})

// 各类型排名柱状图
echarts.init(document.getElementById('post')).setOption({
	title: {
		text: '职位',
		left: 'center',
		textStyle: { fontSize: 24 }
	},
	series: {
		type: 'pie',
		startAngle: '-45',
		center: ['30%', '50%'],
		radius: ['40%', '80%'],
		label: { formatter: '{b}：{c}人，占{d}%' },
		emphasis: { label: { fontSize: 14 } },
		color: ['#f30', '#f90', '#fc0', '#0c0', '#0cc', '#08f', '#80f', '#f08'],
		data: excelPostData
	}
})

// 各省排名柱状图
echarts.init(document.getElementById('pro')).setOption({
	title: {
		text: '各省人数',
		left: 'center',
		textStyle: { fontSize: 24 }
	},
	legend: {
		top: 10,
		left: 100,
		itemWidth: 40,
		itemHeight: 20,
		textStyle: { fontSize: 18 },
		selectedMode: 'single',
    	data: ['全国', '东', '南', '西', '北']
	},
	tooltip: {
		formatter: res => '排名：' + (res.dataIndex + 1)
	},
	xAxis: {
		data: excelProName,
		axisTick: { alignWithLabel: true }
	},
	yAxis: {},
	grid: {
		width: '90%',
		left: '5%'
	},
	series: [
		{
			type: 'bar',
			name: '全国',
			label: { show: true, position: 'top', },
	        itemStyle: {
	        	color: res => {
	        		let c = ''
					proEast.indexOf(res.name) > -1 && (c = '#0c0')
					proSouth.indexOf(res.name) > -1 && (c = '#08f')
					proWest.indexOf(res.name) > -1 && (c = '#f90')
					proNorth.indexOf(res.name) > -1 && (c = '#f30')
					return c
				}
	        },
			data: excelProData
		},
		{
			type: 'bar',
			name: '东',
			label: { show: true, position: 'top' },
	        itemStyle: { color: '#0c0' },
			data: proEastData
		},
		{
			type: 'bar',
			name: '南',
			label: { show: true, position: 'top' },
	        itemStyle: { color: '#08f' },
			data: proSouthData
		},
		{
			type: 'bar',
			name: '西',
			label: { show: true, position: 'top' },
	        itemStyle: { color: '#f90' },
			data: proWestData
		},
		{
			type: 'bar',
			name: '北',
			label: { show: true, position: 'top' },
	        itemStyle: { color: '#f30' },
			data: proNorthData
		}
	]
})

// 中国地图
echarts.init(document.getElementById('china')).setOption({
	backgroundColor: '#666',
	textStyle: { color: '#fff' },
	title: [
		{
			text: '省市人数分布',
			textStyle: { color: '#fff' },
			top: 10,
			left: '38%'
		},
		{
			text: '市人数Top20',
			textStyle: { color: '#fff' },
			top: 30,
			left: '81%'
		}
	],
	tooltip: { formatter: res => res.name ? res.name + '：' + res.value + '人' : '无数据' },
	legend: {
		top: 20,
		left: 50,
		itemWidth: 40,
		itemHeight: 20,
		textStyle: { fontSize: 18 },
		//selected: { '城市气泡': false },
    	data: ['城市气泡']
	},
	geo: {	// 地理坐标系
      	map: 'china',	// 中国地图，先引入js或json，还有世界地图
      	roam: true,		//是否开启缩放
      	layoutSize: 700,	// 地图大小
      	layoutCenter: ['38%', '50%'],	// 地图中心点
      	//label: { show: true, color: '#fff' },	// 省名
      	itemStyle: { color: '#444', borderColor: '#222' },
      	emphasis: {
      		label: { color: '#fff' },
      		itemStyle: { areaColor: '#08f' }
      	}
	},
	visualMap: {	// 视觉映射组件，显示控制范围
		type: 'continuous', // 连续型，还有分段范围型
		min: 0,       		// 值域最小值，必须参数
		max: 200,			// 值域最大值，必须参数
		left: 20,
		bottom: 10,
		seriesIndex: 1,		// 指定关联哪个系列的数据
		calculable: true,	// 是否显示拖拽手柄
		textStyle: { color: '#fff' },	// 值域控件的文本颜色
		inRange: { color: ['#50a3ba','#eac736','#d94e5d'] }	// 指定数值从低到高时的颜色变化
   	},
   	xAxis: {
		type: 'value',
		position: 'top',
		axisLine: {show: false},
        axisTick: {show: false},
        splitLine: {show: false}
	},
	yAxis: {
		type: 'category',
		inverse: true,
		axisLine: {show: false},
        axisTick: {show: false},
        data: excelCityName
	},
	grid: {	// 控制坐标系组件
		top: 100,
		right: 50,
		width: 200
	},
	dataZoom: {	// 市人数Top可拖动组件
		type: 'inside',
		orient: 'vertical',
		zoomLock: true,
		startValue: 0,
		endValue: 20
	},
	series: [
		{
			type: 'scatter',	// 散点气泡图
			name: '城市气泡',
			coordinateSystem: 'geo',	// 坐标系类型
			tooltip: { formatter: res => res.name + '：' + res.value[2] + '人' },
			symbolSize: 12,
			itemStyle: { color: '#f80' },
			data: mapCityLngLatVal
		},
		{
			type: 'map',	// 地理坐标系，会自己生成内部专用的geo组件，但散点气泡图类型只能关联父级的geo等坐标系类型
			name: '省份颜色',
			//map: 'china',	// 中国地图，先引入js或json，还有世界地图
			geoIndex: 0,	// 不用内部geo而是指定一个其他的geo组件，这样就可以和系列类型共享geo，那个geo的颜色也可以被本map系列的data控制了
			// 指定后本map系列样式不再起作用，而是采用那个指定的geo的对应属性，也可以就用指定的geo不用设置map: 'china'属性，不然就有2个了
			data: excelProData	// 设置了visualMap视觉映射组件后可改变颜色
		},
		{
			type: 'bar',
			name: '市人数Top20',
			tooltip: { formatter: res => '排名：' + (res.dataIndex + 1) },
			label: { show: true, position: 'right' },
	        itemStyle: { color: '#ddb926' },
			data: excelCityData
		}
	]
})

// 百度地图
echarts.init(document.getElementById('bmap')).setOption({
	tooltip: { formatter: res => res.name ? res.name + '：' + res.value[2] + '人' : '无数据' },
	visualMap: {
		type: 'continuous',
		min: 0,
		max: 50,
		left: 20,
		bottom: 10,
		calculable: true,
		inRange: { color: ['#50a3ba', '#eac736', '#d94e5d'] }
	},
	series: {
		type: 'scatter',
		coordinateSystem: 'bmap',
		symbolSize: 12,
		data: mapCityLngLatVal
	},
	bmap: {
		center: [116.307698, 40.056975],
		zoom: 5,
		roam: true,
		mapStyle: {
			styleJson: [{
                'featureType': 'water',
                'elementType': 'all',
                'stylers': {
                    'color': '#d1d1d1'
                }
            }, {
                'featureType': 'land',
                'elementType': 'all',
                'stylers': {
                    'color': '#f3f3f3'
                }
            }, {
                'featureType': 'railway',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'highway',
                'elementType': 'all',
                'stylers': {
                    'color': '#fdfdfd'
                }
            }, {
                'featureType': 'highway',
                'elementType': 'labels',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'geometry',
                'stylers': {
                    'color': '#fefefe'
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'geometry.fill',
                'stylers': {
                    'color': '#fefefe'
                }
            }, {
                'featureType': 'poi',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'green',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'subway',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'manmade',
                'elementType': 'all',
                'stylers': {
                    'color': '#d1d1d1'
                }
            }, {
                'featureType': 'local',
                'elementType': 'all',
                'stylers': {
                    'color': '#d1d1d1'
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'labels',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'boundary',
                'elementType': 'all',
                'stylers': {
                    'color': '#fefefe'
                }
            }, {
                'featureType': 'building',
                'elementType': 'all',
                'stylers': {
                    'color': '#d1d1d1'
                }
            }, {
                'featureType': 'label',
                'elementType': 'labels.text.fill',
                'stylers': {
                    'color': '#999999'
                }
            }]
		}
	}
})

// 点击li的时候不触发页面滚动检测li的active
let liClick = true
// 滚动对应li的active
const liActiveFn = function(){
	for(let i = $('.nav li').length - 1; i >= 0; i--){
		if ($(window).scrollTop() > i * 650 - 200) {
			$('.nav li').removeClass('active').eq(i).addClass('active')
			return
		}
	}
}
liActiveFn()	// 初始化检测scrollTop对应li的active
let liTimer = null
// li点击改变active和页面的scrollTop，注意两者的过渡时间保持一致
$('.nav li').on('click', function(){
	$('html').animate({ scrollTop: $(this).index() * 650 - 15})
	$('.nav li').removeClass('active').eq($(this).index()).addClass('active')
	liClick = false
	clearTimeout(liTimer)
	liTimer = setTimeout(()=>{ liClick = true }, 400)
})

// 回到顶部
$('.backbtop').on('click', function(){
	$('html').animate({ scrollTop: 0})
})

// 初始化检测scrollTop回到顶部
$(window).scrollTop() > 500 && $('.backbtop').fadeIn()

// 页面的scrollTop以500为界点显示隐藏和检测li的active
$(window).on('scroll', function(){
	$(this).scrollTop() > 500 ? $('.backbtop').fadeIn() : $('.backbtop').fadeOut()
	liClick && liActiveFn()
})

// 趋势折线图
echarts.init(document.getElementById('freedom')).setOption({
	dataZoom: {
		type: 'slider',
		startValue: data.allFriend.length - 20,
		endValue: data.allFriend.length - 1
	},
	grid: {
		width: '90%',
		left: '5%'
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
		data: ['收入', '基础支出', '合理支出', '额外支出']
	},
	xAxis: {
		data: xDate,
		boundaryGap: false
	},
	yAxis: {},
	series: [
		{
			type: 'line',
			name: '收入',
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
							const result = data.earning[res.dataIndex] - data.earning[res.dataIndex - 1]
							dif = '{earning| (' + (result > 0 ? '+' + result : result) + ')}'
						}
						return res.data + dif
					},
					rich: { earning: { color: '#0c0' } }
				}
			},
			data: data.earning
		},
		{
			type: 'line',
			name: '基础支出',
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
							const result = data.baseOut[res.dataIndex] - data.baseOut[res.dataIndex - 1]
							dif = '{baseOut| (' + (result > 0 ? '+' + result : result) + ')}'
						}
						return res.data + dif
					},
					rich: { baseOut: { color: '#08f' } }
				}
			},
			data: data.baseOut
		},
		{
			type: 'line',
			name: '合理支出',
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
							const result = data.reasonableOut[res.dataIndex] - data.reasonableOut[res.dataIndex - 1]
							dif = '{reasonableOut| (' + (result > 0 ? '+' + result : result) + ')}'
						}
						return res.data + dif
					},
					rich: { reasonableOut: { color: '#f80' } }
				}
			},
			data: data.reasonableOut
		},
		{
			type: 'line',
			name: '额外支出',
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
							const result = data.extraOut[res.dataIndex] - data.extraOut[res.dataIndex - 1]
							dif = '{extraOut| (' + (result > 0 ? '+' + result : result) + ')}'
						}
						return res.data + dif
					},
					rich: { extraOut: { color: '#f80' } }
				}
			},
			data: data.extraOut
		}
	]
})
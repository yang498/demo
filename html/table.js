const data = [
	{ id: 1, name: '大娃', sex: 0, age: 20},
	{ id: 2, name: '二娃', sex: 1, age: 19},
	{ id: 3, name: '三娃', sex: 0, age: 21},
	{ id: 4, name: '四娃', sex: 1, age: 18},
	{ id: 5, name: '五娃', sex: 0, age: 22},
	{ id: 6, name: '六妹', sex: 1, age: 16},
]
const $tbody = $('.tbody')
const $add = $('.table .add')
const $mulSel = $('.multiple-select')
const $mulDel = $('.multiple-del')
const $mulCan = $('.multiple-cancel')
const $done = $('.table .done')
const $addLine = $('.table .add-line')
const $mask = $('.mask')
const addLine = function(item, index) {
	$tbody.innerHTML += `<ul ontransitionend="this.remove()" onmousedown="longpress(this)" onclick="longpressSelect(this)">
		<li class="id">${item.id}</li>
		<li class="name" ondblclick="editName(this, ${index})">${item.name}</li>
		<li class="sex" ondblclick="editSex(this, ${index})">${item.sex ? '女' : '男'}</li>
		<li class="age" ondblclick="editAge(this, ${index})">${item.age}</li>
		<li class="del" onclick="delTr(this, ${index})" ontransitionend="event.stopPropagation()" onmousedown="event.stopPropagation()"><i class="iconfont icon-del"></i></li>
	</ul>`
}
data.forEach((item, index) => addLine(item, index))

// 每行末尾删除单行
const delTr = function(item, index) {
	if(!$tbody.classList.contains('active')) {
		$.popup('确定删除吗？', 'confirm', function(res){
			if(res) {
				data.splice(index, 1)
				item.parentNode.classList.add('ul-del')
				$.toast('删除成功')
			}
		})
	}
}

// 双击可修改姓名、性别、年龄
const editName =  function(item, index) {
	if(!$tbody.classList.contains('active')) {
		item.innerHTML = `<input type="text" placeholder="${data[index].name}" maxlength="5" class="input active" onblur="editDone(this, ${index}, 'name')"/>`
		$('.tbody .input').focus()
		$('.tbody .input').value = data[index].name
	}
}
const editSex =  function(item, index) {
	if(!$tbody.classList.contains('active')) {
		$.popup('要修改性别吗？', 'confirm', function(res){
			if(res) {
				data[index].sex = !data[index].sex
				item.innerText = data[index].sex ? '女' : '男'
				$.toast('修改成功')
			}
		})
	}
}
const editAge =  function(item, index) {
	if(!$tbody.classList.contains('active')) {
		item.innerHTML = `<input type="text" placeholder="${data[index].age}" maxlength="3" class="input active" onblur="editDone(this, ${index}, 'age')" oninput="editNumber(this)"/>`
		$('.tbody .input').focus()
		$('.tbody .input').value = data[index].age
	}
}
const editDone = function(item, index, type){
	item.value && (data[index][type] = item.value)
	item.parentNode.innerText = data[index][type]
}
const editNumber = function(item) {
	item.value = item.value.replace(/[^\d]/, '')
}

// 增加一行
$addLine.on('click', function(){
	$mask.classList.add('active')
	$add.classList.add('active')
})
$mask.on('click', function(){
	this.classList.remove('active')
	$add.classList.remove('active')
})
const inputBlur = function(item) {
	item.classList.remove('fail')
}
const sexSelect = function(item){
	item.parentNode.classList.remove('fail');
	(item.previousElementSibling || item.nextElementSibling).classList.remove('active')
	item.classList.add('active')
}
$done.on('click', function(){
	if($add.classList.contains('active')) {
		let $td = this.parentNode.children
		for(let i = 0; i < $td.length; i++){
			if(/[013]/.test(i) && !$td[i].children[0].value) {
				$td[i].children[0].classList.add('fail')
				$td[i].children[0].focus()
				return
			}
		}
		if(!$td[2].children[0].classList.contains('active') && !$td[2].children[1].classList.contains('active')) {
			$td[2].classList.add('fail')
			return
		}
		
		const item = {
			id: $td[0].children[0].value,
			name: $td[1].children[0].value,
			sex: $td[2].children[0].classList.contains('active') ? 0 : 1,
			age: $td[3].children[0].value,
		}
		addLine(item, data.length)
		data.push(item)
		
		$add.classList.remove('active')
		$mask.classList.remove('active')
		for(let i = 0; i < $td.length; i++) if(/[013]/.test(i)) $td[i].children[0].value = ''
		$td[2].children[0].classList.contains('active') ? $td[2].children[0].classList.remove('active') : $td[2].children[1].classList.remove('active')
	}
})

// 长按多选删除
let longpressTimer = null
const longpress = function(item){
	longpressTimer = setTimeout(() => {
		$tbody.classList.add('active')
		$add.classList.add('active-mul')
	}, 1000)
}
const longpressSelect = function(item) {
	if($tbody.classList.contains('active')) {
		item.classList.toggle('active')
		$mulSel.innerText = '全不选'
		for(let i = 0; i < $$('.tbody ul').length; i++) {
			if(!$$('.tbody ul')[i].classList.contains('active')) {
				$mulSel.innerText = '全选'
				return
			}
		}
	}
}
$tbody.on('mouseup mousemove', function(){
	clearTimeout(longpressTimer)
})
$mulSel.on('click', function(){
	if(this.innerText === '全选') {
		for(let i = 0; i < $$('.tbody ul').length; i++) $$('.tbody ul')[i].classList.add('active')
		this.innerText = '全不选'
	} else {
		for(let i = 0; i < $$('.tbody ul').length; i++) $$('.tbody ul')[i].classList.remove('active')
		this.innerText = '全选'
	}
})
$mulDel.on('click', function(){
	$.popup('确定删除吗？', 'confirm', function(res){
		if(res) {
			for(let i = 0; i < $$('.tbody ul').length; i++) {
				if($$('.tbody ul')[i].classList.contains('active')) {
					data.splice(i, 1)
					$$('.tbody ul')[i].classList.add('ul-del')
				}
			}
			$mulCan.click()
			$.toast('删除成功')
		}
	})
})
$mulCan.on('click', function(){
	$mulSel.innerText = '全选'
	$tbody.classList.remove('active')
	$add.classList.remove('active-mul')
	for(let i = 0; i < $$('.tbody ul').length; i++) $$('.tbody ul')[i].classList.remove('active')
})

let table = {
	// 搜索，击其他操作取消显示结果？？？
	search: function() {
		document.querySelector('.t_search').addEventListener('click', function() {
			var sea = document.querySelector('.ti_search').value,
				tr = document.querySelectorAll('.table tbody tr'),
				name = document.querySelectorAll('.t_name'),
				id = document.querySelectorAll('.t_id');
			if(sea == '') {
				$('#rzsr').modal();
			} else {
				var flag = false;
				for(var i = 0; i < name.length; i++) {
					tr[i].className = '';
					if(sea == name[i].innerHTML) {
						tr[i].className += 'success';
						flag = true;
						return;
					} else if(sea == id[i].innerHTML) {
						tr[i].className += 'success';
						flag = true;
						return;
					} else {
						flag = false;
					}
				}!flag ? $('#smg').modal() : '';
			}
		});
	},

	// 排序
	agesort: function() {
		document.querySelector('.t_sort').addEventListener('click', function() {
			var age = document.querySelectorAll('.t_age'),
				tr = document.querySelectorAll('tbody tr'),
				aage = [];

			age.forEach(function(obj) {
				aage.push(parseInt(obj.innerHTML));
			});

			for(var i = 0; i < aage.length - 1; i++) {
				for(var j = i + 1; j < aage.length; j++) {
					if(aage[i] > aage[j]) {
						var eage = aage[i];
						var etr = tr[i].innerHTML;
						aage[i] = aage[j];
						aage[j] = eage;
						tr[i].innerHTML = tr[j].innerHTML;
						tr[j].innerHTML = etr;
					}
				}
			}
		});
	},

	/*-------------id重排------------*/
	idsort: function() {
		var tr = document.querySelectorAll('tbody tr'),
			id = document.querySelectorAll('.t_id');
		for(var i = 0; i < tr.length; i++) {
			id[i].innerHTML = i + 1;
		}
	}
	
	// 超过10条分页

	//		重置ID,编辑，动画效果，单独操作,毛玻璃效果，选择删除完该干什么，排序按照什么方式
}

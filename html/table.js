const $ = function(el) {
	const res = document.querySelectorAll(el)
	return res.length === 1 ? res[0] : res
}
HTMLElement.prototype.fd = function(el) {
	const res = this.querySelectorAll(el)
	return res.length === 1 ? res[0] : res
}
HTMLElement.prototype.on = function(type, fn) {
	/\s/.test(type) ? type.split(' ').forEach(item => this.addEventListener(item, fn)) : this.addEventListener(type, fn)
	return this
}
HTMLElement.prototype.index = function() {
	for(let i = 0; i < this.parentNode.children.length; i++) if(this.parentNode.children[i] === this) return i
}

const data = [
	{ id: 1, name: '大娃', sex: 0, age: 20},
	{ id: 2, name: '二娃', sex: 1, age: 19},
	{ id: 3, name: '三娃', sex: 0, age: 21},
	{ id: 4, name: '四娃', sex: 1, age: 18},
	{ id: 5, name: '五娃', sex: 0, age: 22},
]
const $tbody = $('.tbody')
const $addLine = $('.table .add-line')
const $addInput = $('.table .add-input')
const $mask = $('.mask')
const addLine = function(item, index) {
	$tbody.innerHTML += `<ul ontransitionend="this.remove()">
		<li class="id">${item.id}</li>
		<li class="name" ondblclick="editName(this, ${index})">${item.name}</li>
		<li class="sex" ondblclick="editSex(this, ${index})">${item.sex ? '女' : '男'}</li>
		<li class="age" ondblclick="editAge(this, ${index})">${item.age}</li>
		<li class="del" onclick="delTr(this)" ontransitionend="event.stopPropagation()"><i class="iconfont icon-del"></i></li>
	</ul>`
}
data.forEach((item, index) => addLine(item, index))

// 每行末尾删除单行
const delTr = function(item) {
	confirm('确定删除吗？') && item.parentNode.classList.add('ul-del')
}

// 双击可修改姓名、性别、年龄
const editName =  function(item, index) {
	item.innerHTML = `<input type="text" placeholder="${data[index].name}" maxlength="5" class="input" onblur="editDone(this, ${index}, 'name')"/>`
	$('.table .input').focus()
	$('.table .input').value = data[index].name
}
const editSex =  function(item, index) {
	if(confirm('要修改性别吗？')) {
		data[index].sex = !data[index].sex
		item.innerText = data[index].sex ? '女' : '男'
	}
}
const editAge =  function(item, index) {
	item.innerHTML = `<input type="text" placeholder="${data[index].age}" maxlength="3" class="input" onblur="editDone(this, ${index}, 'age')" oninput="editNumber(this)"/>`
	$('.table .input').focus()
	$('.table .input').value = data[index].age
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
	this.classList.add('active')
	$mask.classList.add('active')
	$addInput.classList.add('active')
})
$mask.on('click', function(){
	this.classList.remove('active')
	$addInput.classList.remove('active')
})
const inputBlur = function(item) {
	item.classList.remove('fail')
}
const sexSelect = function(item){
	item.parentNode.classList.remove('fail');
	(item.previousElementSibling || item.nextElementSibling).classList.remove('active')
	item.classList.add('active')
}
$('.table .done').on('click', function(){
	if($addLine.classList.contains('active')) {
		
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
		
		$addLine.classList.remove('active')
		for(let i = 0; i < $td.length; i++) if(/[013]/.test(i)) $td[i].children[0].value = ''
		$td[2].children[0].classList.contains('active') ? $td[2].children[0].classList.remove('active') : $td[2].children[1].classList.remove('active')
	}
})

let table = {
	// 删除多行
	dels: function() {
		var tr_dels = document.querySelector('.t_chdel'), //批量删除
			acc = document.querySelector('.t_chcan'), //完成
			deldel = document.querySelector('.t_deldel'), //删除选中的
			all = document.querySelector('.t_all'); //全选

		function varDels() {
			this.choice = document.querySelectorAll('.t_choice'); //每个tr的第一个td选择，包括第一个全选按钮
			this.check = document.querySelectorAll('i'); //每个选择的icon
			this.ckd = document.querySelectorAll('.glyphicon-check'); //每个选中的icon
			this.tr_del = document.querySelectorAll('.t_del'); //每个tr的删除按钮
			this.tr_edit = document.querySelectorAll('.t_edit'); //每个tr的编辑按钮
		}

		function allYes() {
			all.innerHTML = '全选';
			all.className = 'btn btn-primary t_all';
		}

		function allNo() {
			all.innerHTML = '全不选';
			all.className = 'btn btn-info t_all';
		}

		//点击全选
		all.addEventListener('click', function() {
			varDels();
			if(this.innerHTML == '全选') {
				for(var i = 0; i < check.length; i++) {
					check[i].className = 'glyphicon glyphicon-check';
				}
				allNo();
			} else if(this.innerHTML == '全不选') {
				for(var i = 0; i < check.length; i++) {
					check[i].className = 'glyphicon glyphicon-unchecked';
				}
				allYes();
			} else {
				return;
			}
			varDels();
			ckd.length == 0 ? deldel.setAttribute('disabled', true) : deldel.removeAttribute('disabled');
		});

		//点击每个选择按钮
		(function() {
			varDels();
			for(var i = 0; i < check.length; i++) {
				check[i].addEventListener('click', function() {
					this.className == 'glyphicon glyphicon-unchecked' ? this.className = 'glyphicon glyphicon-check' : this.className = 'glyphicon glyphicon-unchecked';
					varDels();
					ckd.length == check.length ? allNo() : allYes();
					ckd.length == 0 ? deldel.setAttribute('disabled', true) : deldel.removeAttribute('disabled');
				});
			}
		})();

		//点击批量删除
		tr_dels.addEventListener('click', function() {
			varDels();
			for(var i = 0; i < choice.length; i++) {
				choice[i].style.display = 'table-cell';
			}
			this.style.display = 'none';
			acc.style.display = 'block';
			deldel.style.display = 'block';
			for(var i = 0; i < tr_del.length; i++) {
				tr_del[i].setAttribute('disabled', true);
				tr_edit[i].setAttribute('disabled', true);
			}
		});

		//点击完成
		acc.addEventListener('click', function() {
			varDels();
			for(var i = 0; i < choice.length; i++) {
				choice[i].style.display = '';
			}
			for(var i = 0; i < check.length; i++) {
				check[i].className = 'glyphicon glyphicon-unchecked';
				tr_del[i].removeAttribute('disabled');
				tr_edit[i].removeAttribute('disabled');
			}
			this.style.display = 'none';
			deldel.style.display = 'none';
			tr_dels.style.display = 'block';
			deldel.setAttribute('disabled', true);
			allYes();
		});

		//删除选中的
		deldel.addEventListener('click', function() {
			varDels();
			$("#zdsc").modal();
			document.querySelector('.m_zd').addEventListener('click', function() {
				$("#zdsc").modal('hide');
				for(var i = 0; i < check.length; i++) {
					check[i].parentNode.parentNode.parentNode.removeChild(check[i].parentNode.parentNode);
				}
				table.idsort();
			});
			document.querySelector('.m_sd').addEventListener('click', function() {
				$("#zdsc").modal('hide');
			});
		});
	},

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

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
	{ id: 6, name: '六娃', sex: 1, age: 17},
	{ id: 7, name: '七娃', sex: 0, age: 23}
]

data.forEach((item, index) => {
	$('tbody').innerHTML += `<tr>
		<td class="id">${item.id}</td>
		<td class="name" onclick="editName(this,${index})">${item.name}</td>
		<td class="sex" onclick="editSex(this,${index})">${item.sex ? '女' : '男'}</td>
		<td class="age" onclick="editAge(this,${index})">${item.age}</td>
		<td class="del" onclick="delTr(this)"><i class="iconfont icon-del"></i></td>
	</tr>`
})

// 只能输入数字
const editNumber = function() {
	this.value = this.value.replace(/[^\d]/, '')
}

// 每行末尾删除单行
const delTr = function(item) {
	confirm('确定删除吗？') && item.parentNode.remove()
}

// 双击可修改姓名、性别、年龄
const editName =  function(item, index) {
	item.innerHTML = `<input type="text" placeholder="${data[index].name}" maxlength="5" class="td-edit">`
	$('.td-edit').focus()
	$('.td-edit').value = data[index].name
	$('.td-edit').on('blur', function(){
		this.value && (data[index].name = this.value)
		item.innerText = data[index].name
	})
}
const editSex =  function(item, index) {
	if(confirm('要修改性别吗？')) {
		data[index].sex = !data[index].sex
		item.innerText = data[index].sex ? '女' : '男'
	}
}
const editAge =  function(item, index) {
	item.innerHTML = `<input type="text" placeholder="${data[index].age}" maxlength="3" class="td-edit">`
	$('.td-edit').focus()
	$('.td-edit').value = data[index].age
	$('.td-edit').on('input', editNumber).on('blur', function(){
		this.value && (data[index].age = this.value)
		item.innerText = data[index].age
	})
}

// 增加一行
$('tfoot').on('click', function(){
	$('tbody').innerHTML += `<tr>
		<td class="id"><input type="text" placeholder="ID" maxlength="4" class="td-edit td-number"></td>
		<td class="name"><input type="text" placeholder="姓名" maxlength="5" class="td-edit"></td>
		<td class="sex"><input type="radio" name="sex" value="0"/>男 <input type="radio" name="sex" value="1"/>女</td>
		<td class="age"><input type="text" placeholder="年龄" maxlength="3" class="td-edit td-number"></td>
		<td class="tr-done">完成</td>
	</tr>`
	for(let i = 0; i < $('.td-number').length; i++) $('.td-number')[i].on('input', editNumber)
	$('.tr-done').on('blur', function(){
		this.classList.remove('td-edit-fail')
	}).on('click', function(){
		let $td = this.parentNode.children
		let isDone = true
		for(let i = 0; i < $td.length; i++) {
			if(/[013]/.test(i) && !$td[i].children[0].value){
				$td[i].children[0].classList.add('td-edit-fail')
				$td[i].children[0].focus()
				isDone = false
			}
		}
		if(!$td[2].children[0].checked && !$td[2].children[1].checked) {
			$td[2].classList.add('td-edit-fail-td')
			isDone = false
		}
		if(isDone) {
			const item = {
				id: $td[0].children[0].value,
				name: $td[1].children[0].value,
				sex: $td[2].children[0].checked ? 0 : 1,
				age: $td[3].children[0].value,
			}
			data.push(item)
			$('tbody tr:last-child').remove()
			$('tbody').innerHTML += `<tr>
				<td class="id">${item.id}</td>
				<td class="name">${item.name}</td>
				<td class="sex">${item.sex ? '女' : '男'}</td>
				<td class="age">${item.age}</td>
				<td class="del"><i class="iconfont icon-del"></i></td>
			</tr>`
			$('tbody tr:last-child .name').on('dblclick', editName(data.length - 1))
			$('tbody tr:last-child .sex').on('dblclick', editSex(data.length - 1))
			$('tbody tr:last-child .age').on('dblclick', editAge(data.length - 1))
			$('tbody tr:last-child .del').on('click', delTr(data.length - 1))
		}
	})
})

let table = {
	// 增加一行
	add: function() {
		document.querySelector('.t_add').addEventListener('click', function() {
			var name = document.querySelector('.ti_name').value,
				sex = document.querySelector('.ti_sex').value,
				age = document.querySelector('.ti_age').value,
				trl = document.querySelectorAll('.table tbody tr').length;

			if(!isNaN(name) || name == '' || isNaN(age) || age == '') {
				$('#rzsr').modal();
			} else {
				document.querySelector('.table tbody').innerHTML += '<tr><td class="t_choice"><i class="glyphicon glyphicon-unchecked"></i></td><td class="t_id">' + (++trl) + '</td><td class="t_name">' + name + '</td><td class="t_sex">' + sex + '</td><td class="t_age">' + age + '</td><td class="t_operate"><button class="btn btn-success t_edit">编辑</button><button class="btn btn-danger t_del">删除</button></td></tr>';
				table.del();
			}
		});
	},

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

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

	// 删除一行
	del: function() {
		var btn = document.querySelectorAll('.t_del');
		for(var i = 0; i < btn.length; i++) {
			btn[i].addEventListener('click', function() {
				var that = this.parentNode.parentNode;
				$("#zdsc").modal();
				document.querySelector('.m_zd').addEventListener('click', function() {
					$("#zdsc").modal('hide');
					that.parentNode.removeChild(that);
					table.idsort();
				});
				document.querySelector('.m_sd').addEventListener('click', function() {
					$("#zdsc").modal('hide');
				});
			});
		}
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
};
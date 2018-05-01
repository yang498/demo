// querySelector和querySelectorAll IE8+浏览器支持
// 注意:是先在全局范围内搜索给定的CSS选择器，然后过滤出哪些属于当前元素的子元素
// 搞完列一遍所有的方法
/*
	$：获取单个元素
	$$：获取多个元素
	el.on('type', fn)：元素绑定事件
	el.index()：获取该元素是第几个
	el.addClass('class')：添加class，仅限多个元素，单个的还是原生
	el.removeClass('class')：删除class，仅限多个元素，单个的还是原生
	$.popup('text', 'type', callback)：弹框，type可选confirm，否则就是alert
	$.toast('text', duration = 2000)：提示框
*/

const $ = el => document.querySelector(el)
const $$ = el => document.querySelectorAll(el)
HTMLElement.prototype.fd = function(el) {
	const res = this.querySelectorAll(el)
	return res.length === 1 ? res[0] : res
}
HTMLElement.prototype.on = function(type, fn) {
	/\s/.test(type) ? type.split(' ').forEach(item => this.addEventListener(item, fn)) : this.addEventListener(type, fn)
	return this
}
NodeList.prototype.on = function(type, fn) {
	for(let i = 0; i < this.length; i++) /\s/.test(type) ? type.split(' ').forEach(item => this[i].addEventListener(item, fn)) : this[i].addEventListener(type, fn)
}
HTMLElement.prototype.index = function() {
	for(let i = 0; i < this.parentNode.children.length; i++) if(this.parentNode.children[i] === this) return i
}
NodeList.prototype.addClass = function(cl) {
	for(let i = 0; i < this.length; i++) this[i].classList.add(cl)
}
NodeList.prototype.removeClass = function(cl) {
	for(let i = 0; i < this.length; i++) this[i].classList.remove(cl)
}

$.popup = function(text, type, callback) {
	// type应该是可选,还有其他动画
	$('body').insertAdjacentHTML('beforeend', `
	<div id="popup">
		<div class="popup-mask"></div>
		<div class="popup">
			<div class="popup-content">
				<div class="popup-text">${text}</div>
			</div>
			<div class="popup-footer">
				<div class="popup-btn" ontransitionend="event.stopPropagation()">确定</div>
				<div class="popup-btn-other ${type==='confirm'?'':'hide'}" ontransitionend="event.stopPropagation()">取消</div>
			</div>
		</div>
	</div>`)
	setTimeout(function(){
		$('#popup').classList.add('active')
	}, 1)
	const remove = function(res) {
		$('#popup').on('transitionend', function(){
			this.remove()
			callback && callback(res)
		}).classList.remove('active')
	}
	$('.popup-btn').on('click', function(){
		remove(true)
	})
	$('.popup-btn-other, .popup-mask').on('click', function(){
		remove(false)
	})
}

// 触发body添加元素,异步1毫秒添加active淡入,默认定时3秒删除
$.toastTimer = null
$.toast = function(text, duration = 2000) {
	clearTimeout($.toastTimer)
	$$('#toast').length && $('#toast').remove()
	$('body').insertAdjacentHTML('beforeend', '<div id="toast">' + text + '</div>')
	setTimeout(function(){
		$('#toast').classList.add('active')
	}, 1)
	$.toastTimer = setTimeout(function(){
		$$('#toast').length && $('#toast').on('transitionend', function(){
			this.remove()
		}).classList.remove('active')
	}, duration)
}

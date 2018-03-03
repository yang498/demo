let tipsTimer = null
const $body = document.querySelector('body')
const $name = document.querySelector('.name')
const $phone = document.querySelector('.phone')
const $btn = document.querySelector('.btn')
const showTips = (text, time = 2000) => {
	tipsTimer && clearTimeout(tipsTimer)
	document.querySelector('.tips') && document.querySelector('.tips').remove()
	$body.insertAdjacentHTML('beforeend', '<div class="tips" style="animation-duration: ' + time + 'ms;">' + text + '</div>')
	tipsTimer = setTimeout(() => {
		document.querySelector('.tips').remove()
	}, time)
}

$btn.addEventListener('click', function() {
	if(!$name.value || /[^a-zA-Z\u4e00-\u9fa5]/.test($name.value)) {
		showTips('请正确输入姓名')
	} else if(!/^1[3-9]\d{9}$/.test($phone.value)) {
		showTips('请正确输入手机号')
	} else {
		document.querySelector('form').submit()
	}
})
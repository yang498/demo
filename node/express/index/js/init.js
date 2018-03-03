(() => {
	const $html = document.querySelector('html')
	$html.style.fontSize = Math.min(150, $html.clientWidth / 375 * 100) + 'px'
})()
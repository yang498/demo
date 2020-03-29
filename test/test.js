// 父元素设置了 animation-fill-mode: backwards; 会限制使用了 fixed 定位的子元素的范围？？
// jq 的 on 的多种书写方式，addEventLi 也是一样吗
// 资源链接应该都采用 MDN 的，换掉 ASC|| 和键盘码
// a 标签 jq 触发不了 $('a').click()，原生才行，不是版本的原因？？
// const { log } = console
const [$, {log}] = [document.querySelector.bind(document), console]
$('.demo').onclick = function () {
    // 下载的数据
    const arr = [
        ['姓名',  '性别', '年龄', '注册时间'],
        ['李雷',   '男',   22,    new Date],
        ['韩梅梅', '女',   20,    new Date]
    ]
    // 转换成表对象，格式和 XLSX.utils.sheet_to_json 返回的一样
    const excel = {
        SheetNames: ['sheet1'],
        Sheets: {
            sheet1: XLSX.utils.aoa_to_sheet(arr)
        }
    }
    // 转换成表格格式的字符串数据
    const data = XLSX.write(excel, {bookType: 'xlsx', type: 'binary'})
    // 转换成 ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    // 转换成可下载的 blob 对象
    const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const url = URL.createObjectURL(new Blob([s2ab(data)], {type}))
    // 用 a 链接下载
    const a = document.createElement('a')
    a.href = url
    a.download = '用户表'
    a.click()
}
// $.ajaxPrefilter(function(options) {
// 　　if(options.crossDomain && jQuery.support.cors) {
// 　　var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
// 　　options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
// 　　}
// });
    
// var share_link = "https://mp.weixin.qq.com/s/Ja1kDrc0YpQJWN0PszCWpA"; //微信文章地址
// $.get(
// 　　share_link,
// 　　function(response) {
// 　　//console.log("> ", response);
// 　　var html = response;
// 　　html = html.replace(/data-src/g, "src");
// 　　var html_src = 'data:text/html;charset=utf-8,' + html;
// 　　$("iframe").attr("src", html_src);
// });
const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')  //把localStorage内存的东西读出来
// console.log(x);
//先尝试读取当前网站下的x，如果x能成功变成对象，就把对象放到hashmap里面，不行的话就初始化为默认的数组（一开始定义好的）
const xObject = JSON.parse(x)
const hashMap = xObject||[ //xObject存在就使用，不存在就用默认值先
    { logo: 'A', url:'https://www.acfun.cn/' },
    { logo: 'B', url: 'https://www.bilibili.com/' },
    { logo: 'T', url:'https://www.taobao.com/'},
]
const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http:', '')
        .replace('www.', '')
        .replace(/\/.*/,'')//删除/开头的内容直到结尾
}
const $inp = $('#inp')
$inp.on('keypress', (e) => { //阻止input输入时冒泡
    e.stopPropagation()
})
let btn = document.querySelector('#btn') //获取按钮
let inp = document.querySelector('#inp') //获取文本框
let flag = 0
btn.disabled=true
inp.onfocus = function () {
    if (inp.value === '') {
    flag = 0
    btn.disabled=true
} else {
    flag = 1
    btn.disabled=false
}
}
inp.oninput = function () {
    if (inp.value === '') {
    flag = 0
    btn.disabled=true
} else {
    flag = 1
    btn.disabled=false
    }  
}

const render = () => { //渲染hashmap时先把之前的li全部删掉再重新渲染
    $siteList.find('li:not(.last)').remove()
    hashMap.forEach((node, index) => { //遍历hashmap，生成li
        // console.log(index)
    const $li = $(`<li>  
                    <div class="site">
                        <div class="logo">${node.logo}</div>
                        <div class="link">${simplifyUrl(node.url)}</div>
                        <div class="close">
                          <svg class="icon">
                            <use xlink:href="#icon-shanchu"></use>
                          </svg>
                        </div>         
                    </div>
    </li>`).insertBefore($lastLi)
        $li.on('click', () => {
            window.open(node.url)
        })
        $li.on('click', '.close', (e) => {
            e.stopPropagation() //删除按钮阻止冒泡
            hashMap.splice(index, 1) //删除被索引的下标元素
            render() //重新渲染页面
    })
})
}
render()
$('.addButton').on('click', () => {
    let url = prompt('请输入您需要添加的网址')
    if (url.indexOf('http')!==0) {
        url='https://'+url  //https的网址更安全
    }
    hashMap.push({ //先render，然后push，再render
        logo: simplifyUrl(url).toUpperCase()[0],
        url:url
    })
    render()
})
window.onbeforeunload=()=> { //关闭页面时在这个函数里把hashmap存下来
    // console.log('页面即将关闭')
    const string = JSON.stringify(hashMap)
    localStorage.setItem('x',string) //在本地存储里面设置一个key为x，它的值为string
}
//键盘事件
$(document).on('keypress', (e) => { //键盘按下事件
    // console.log('你按下了键盘');
    const { key } = e
    for (let i = 0; i < hashMap.length; i++){
        if (hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url)
        }
    }
}) 
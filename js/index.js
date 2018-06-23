const video = document.querySelector('#video') // 获得视频对象
const play = document.querySelector('#play') // 播放按钮
const voice = document.querySelector('#voice') // 音量按钮
const progress = document.querySelector('#progress') // 播放进度条
const timeDisplay = document.querySelector('#time_display') // 当前播放时间和视频总时间
const voicePanel = document.querySelector('#voice_panel') // 音量面板
const voiceTip = document.querySelector('#voice_tip') // 音量多少提示
const voiceBar = document.querySelector('#voice_bar') // 音量进度条
const voiceCircle = document.querySelector('#voice_circle') // 音量进度条上的控制点
const timeTip = document.querySelector('#time_tip') // 播放进度条上显示指定播放时间的提示板
const timeText = document.querySelector('#time_text') // 播放进度条上显示指定播放时间的提示时间
const timeArrow = document.querySelector('#time_arrow') // 播放进度条上显示指定播放时间的箭头
const control = document.querySelector('#control') // 播放器最下面的播放面板
const player = document.querySelector('#player') // 播放器
const btnList = document.querySelector('#btnList')
const listPanel = document.querySelector('#listPanel')
const list = document.querySelector('#list')
const listBar = document.querySelector('#listBar')
const listContainer = document.querySelector('#listContainer')
const title = document.querySelector('#title')

const videoLists = [
    {
        name: '王菲 - 暧昧.mp4',
        path: 'video/王菲 - 暧昧.mp4'
    },
    {
        name: '王菲 - 红豆.mp4',
        path: 'video/王菲 - 红豆.mp4'
    },
    {
        name: 'S.H.E - 不想长大.mp4',
        path: 'video/S.H.E - 不想长大.mp4'
    },
    {
        name: '朴树 - 平凡之路.mp4',
        path:'video/朴树 - 平凡之路.mp4'
    },
    {
        name:'杨千嬅 - 小城大事.mp4',
        path:'video/杨千嬅 - 小城大事.mp4'
    }
]

function selectVideo(e) {
    const { path, name } = e.target.dataset
    video.src = path
    title.innerText = name
    video.play()
    play.innerText = '暂停'
    isPlay = true
    listPanel.style.display = 'none'
    isShowListPanel = false
}

function init() {
    const length = videoLists.length

    for (let i = 0; i < length; i++) {
        const li = document.createElement('li')
        li.innerText = videoLists[i].name
        li.setAttribute('data-path', videoLists[i].path)
        li.setAttribute('data-name', videoLists[i].name)
        list.appendChild(li)
        li.onclick = selectVideo
    }
}

init()

// contextmenu事件就是关于鼠标右击的事件
video.oncontextmenu = function(e) {
    // 在video控件上禁止右击
    return false
}

//这样不行，有问题
// video.addEventListener('contextmenu',()=>{
//     return false
// })

// 让列表滚动条可以上下滚动
// 有bug，拖动滚动条时不流畅，有时候拖动了滚动条后，再次拖动会直接回到顶部
listBar.addEventListener('mousedown', e => {
    // 先求出列表距离浏览器顶部的距离
    // listBar,listPanel,control
    const length = listBar.offsetTop + listPanel.offsetTop + control.offsetTop

    const minY = listContainer.offsetTop
    const maxY = listContainer.offsetTop + listContainer.offsetHeight - listBar.offsetHeight
    // console.log(listContainer.scrollHeight)

    document.onmousemove = e => {
        let listBarTop = e.pageY - length

        if (listBarTop < minY) {
            listBarTop = minY
        }

        if (listBarTop > maxY) {
            listBarTop = maxY
        }
        const containerTop = (listBarTop - listContainer.offsetTop) / listContainer.offsetHeight * listContainer.scrollHeight
        listContainer.scrollTop = containerTop
        // console.log(containerTop)

        listBar.style.top = listBarTop + 'px'
    }
})

let isShowListPanel = false
btnList.addEventListener('click', e => {
    if (isShowListPanel) {
        listPanel.style.display = ''
    } else {
        listPanel.style.display = 'block'
        if (list.offsetHeight > listContainer.offsetHeight) {
            const listBarLength = listContainer.offsetHeight / list.offsetHeight * listContainer.offsetHeight
            listBar.style.height = listBarLength + 'px'
        } else {
            listBar.style.display = 'none'
        }
    }

    isShowListPanel = !isShowListPanel
})

/*
1.先求出滚动条距离顶部的距离
2.求出拖动的位置距离顶部的距离
3.用滚动条距离顶部的距离 - 拖动位置距离顶部的距离，就是圆圈要移动的距离
*/
voiceCircle.addEventListener('mousedown', e => {
    // 求出voiceBar距离顶部的距离
    // 为什么求voiceBar距离顶部的距离，要减去voiceCircle的高度后的结果，才正确
    const length = voiceBar.offsetTop + voicePanel.offsetTop + control.offsetTop + player.offsetTop - voiceCircle.offsetHeight
    const maxY = voiceBar.offsetHeight - voiceCircle.offsetHeight
    document.onmousemove = e => {
        // e.pageY就是鼠标拖动时距离顶部的高度
        let Y = e.pageY - length

        if (Y < 0) {
            Y = 0
        }

        if (Y > maxY) {
            Y = maxY
        }

        voiceCircle.style.top = Y + 'px'
        const rate = (maxY - voiceCircle.offsetTop) / maxY
        let voiceValue = rate * 100
        voiceValue = Number.parseInt(voiceValue)
        voiceTip.innerText = voiceValue
        video.volume = rate
        voiceBar.style.background = `linear-gradient(to top,#157bf0, #157bf0 ${voiceValue}%,#fff ${voiceValue}%,#fff)`
        if (voiceValue === 0) {
            voice.innerText = '静音'
        } else {
            voice.innerText = '音量'
        }
    }
})

// 鼠标放开事件
document.onmouseup = (e) => {
    document.onmousemove = null
}

// offsetParent：当前元素最近的经过定位(position不等于static)的父级元素
// 鼠标移入滚动条的事件
progress.addEventListener('mouseover', e => {


    timeTip.style.display = 'block'
})

// 鼠标在进度条上移动时，时间提示框跟着移动
progress.addEventListener('mousemove', e => {
    // 因为progress上面有一个不为position不等于static的父级元素，所以offsetLeft不是到最左的距离
    // control上面没有position不等于static的父级元素，所以offsetLeft是到最左的距离
    // 所以滚动条到页面最左的距离就是progress.offsetLeft + control.offsetLeft

    const length = progress.offsetLeft + control.offsetLeft

    let timeTipLeft = e.pageX - length
    timeTipLeft = timeTipLeft < 0 ? 0 : timeTipLeft
    const tipW = timeTip.offsetWidth / 2 //获得timeTip的宽度

    const arrowW = timeArrow.offsetWidth / 2 //获得timeArrow的宽度
    const lW = tipW - arrowW // 这个就是箭头的左偏移值
    timeArrow.style.left = lW + 'px'

    let endW = timeTipLeft - tipW

    if (endW < 0 - tipW) {
        endW = 0 - tipW
    }

    if (endW > progress.offsetWidth - tipW) {
        endW = progress.offsetWidth - tipW
    }

    timeTip.style.left = endW + 'px'
    let videoSecond = Math.floor(timeTipLeft / progress.offsetWidth * video.duration)
    const duration = video.duration
    videoSecond = videoSecond > duration ? duration : videoSecond
    const minute = Math.floor(videoSecond / 60)
    const second = Math.floor(videoSecond % 60)
    let strSecond = second.toString().padStart(2, '0')
    timeText.innerText = `${minute}:${strSecond}`
})

// 鼠标移出滚动条的事件
progress.addEventListener('mouseout', e => {
    timeTip.style.display = ''
})

// 点击进度条设置播放时间
progress.addEventListener('click', e => {
    const length = progress.offsetLeft + control.offsetLeft

    let timeTipLeft = e.pageX - length
    timeTipLeft = timeTipLeft < 0 ? 0 : timeTipLeft
    let videoSecond = Math.floor(timeTipLeft / progress.offsetWidth * video.duration)
    const duration = video.duration
    videoSecond = videoSecond > duration ? duration : videoSecond
    video.currentTime = videoSecond
})

// isPlay 是否播放的标志
let isPlay = false
play.addEventListener('click', () => {
    if (isPlay === false) {
        video.play()
        play.innerText = '暂停'
    } else {
        video.pause()
        play.innerText = '播放'
    }

    isPlay = !isPlay
})

// 是否显示声音控制面板
let isShowVoicePanel = false
voice.addEventListener('click', () => {
    if (isShowVoicePanel) {
        voicePanel.style.display = 'none'
    } else {
        voicePanel.style.display = 'block'
    }

    isShowVoicePanel = !isShowVoicePanel
})

// 播放时间更新时，调用的函数
video.addEventListener('timeupdate', () => {
    updateProgress()
    setTimeDisplay()

    // 如果播放结束，设置按钮文字和播放标志
    if (video.ended) {
        play.innerText = '播放'
        isPlay = false
    }
})

// 实时更新滚动条
function updateProgress() {
    // 先获得视频的总秒数duration,当前播放的秒数currentTime
    const { duration, currentTime } = video
    // 获得滚动条的总宽度
    const { offsetWidth: progressTotalLength } = progress
    // 用视频的currentTime/duration，得到一个比值
    const rate = currentTime / duration
    // 用滚动条总宽度乘以这个比值，得到滚动条播放时的宽度
    const progressCurrentLength = progressTotalLength * rate
    // length就是一个百分比，因为是用渐变色来设置滚动颜色的
    const length = progressCurrentLength / progressTotalLength * 100
    progress.style.background = `linear-gradient(to right,red, red ${length}%,#b4b1b1 ${length}%,#b4b1b1)`
}

// 设置视频播放时的时间显示
function setTimeDisplay() {
    const { duration, currentTime } = video
    const currentTimeMinute = Math.floor(currentTime / 60)
    const currentTimeSecond = Math.floor(currentTime % 60)
    const durationMinute = Math.floor(duration / 60)
    const durationSecond = Math.floor(duration % 60)
    if (isNaN(durationMinute) || isNaN(durationSecond)) {
        timeDisplay.innerText = '0:00 / 0:00'
    } else {
        let strCurrentTimeSecond = currentTimeSecond.toString().padStart(2, '0')
        let strDurationSecond = durationSecond.toString().padStart(2, '0')
        timeDisplay.innerText = `${currentTimeMinute}:${strCurrentTimeSecond} / ${durationMinute}:${strDurationSecond}`
    }
}
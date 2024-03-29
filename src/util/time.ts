
//将音乐播放时间的时间戳转变为分秒。
export function changetime(msg: number) {
    let second = msg / 1000;
    let minute = ~~(second / 60);
    let over = (second % 60).toFixed(0); //保留0位小数
    let sminute = minute.toString();
    let sover = over.toString();
    if (minute < 10) sminute = '0' + minute.toString();
    if (+over < 10) sover = '0' + over.toString();
    return sminute + ':' + sover;
}

// 将时间转化为 时分秒
export function judegtime(time: number) {
    let s = ''
    const second = time % 60;
    const minute = Math.floor(time / 60 % 60);
    const hours = Math.floor(time / 3600);

    if (hours >= 1) {
        s += hours + '小时'
    }
    if (minute >= 1) {
        s += minute + '分钟';
    }
    if (minute > 0 || hours > 0) {
        if (second >= 1) {
            s += second + '秒'
        }
    } else {
        s += second + '秒'
    }
}

export function formatZero(num: number | string, len: number) {
    if (String(num).length > len) return num
    return (Array(len).join("0") + num).slice(-len)
};

// 秒转00:00
export function formatSecondTime(interval: number) {
    interval = interval | 0
    const m = (interval / 60) | 0
    const s = interval % 60
    return `${formatZero(m, 2)}:${formatZero(s, 2)}`
};

// 转换成秒
export function formatSecond(time: number) {
    time = ~~time;
    var secondTime
    if (time < 10) {
        secondTime = '00:0' + time
    } else if (time < 60) {
        secondTime = '00:' + time
    } else {
        var m = ~~((time % (1000 * 60 * 60)) / (1000 * 60))
        var s = ~~((time % (1000 * 60)) / 1000)
        secondTime = Number(m * 60 + s)
    }
    return secondTime as number;
}

// 日期格式化
export function dateFormat(str: number | string, type: string) {
    let date = new Date(str)
    let year = date.getFullYear()
    let month = formatZero(date.getMonth() + 1, 2)
    let day = formatZero(date.getDate(), 2)
    let hour = formatZero(date.getHours(), 2)
    let minute = formatZero(date.getMinutes(), 2)
    let seconds = formatZero(date.getSeconds(), 2)
    if (type == 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`
    } else if (type == 'YYYY-MM-DD HH:MM:SS') {
        return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
    } else if (type == 'MM/DD  HH:MM:SS') {
        return `${month}/${day} ${hour}:${minute}:${seconds}`
    }
};

// 获取当前时间前后N天前后日期
export function getDateBefore(dayCount: number) {
    var date = new Date()
    date.setDate(date.getDate() + dayCount)
    let year = date.getFullYear()
    let month = formatZero(date.getMonth() + 1, 2)
    let day = formatZero(date.getDate(), 2)
    return `${year}-${month}-${day}`
};

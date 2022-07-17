
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
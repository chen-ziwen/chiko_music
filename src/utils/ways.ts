
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
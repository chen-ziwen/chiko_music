
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
function judegtime(time: number) {
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

// 将屏幕滚动到顶部
export function scrollTop() {
    let timer: NodeJS.Timer | undefined = undefined;
    return (delay: number = 15, step: number = 35) => {
        if (timer) {
            clearInterval(timer)
        }
        timer = setInterval(() => {
            document.documentElement.scrollTop -= step;
            if (document.documentElement.scrollTop <= 0) {
                document.documentElement.scrollTop = 0;
                clearInterval(timer as NodeJS.Timer);
            }
        }, delay)
    }
}

// 将屏幕滚动到顶部 类写法
export class ScrollTop {
    private timer: NodeJS.Timer | undefined;
    public readonly scroll: () => void;
    constructor() {
        this.timer = undefined;
        this.scroll = (delay: number = 15, step: number = 35) => {
            if (this.timer) {
                clearInterval(this.timer)
            }
            this.timer = setInterval(() => {
                document.documentElement.scrollTop -= step;
                if (document.documentElement.scrollTop <= 0) {
                    document.documentElement.scrollTop = 0;
                    clearInterval(this.timer as NodeJS.Timer);
                }
            }, delay)
        }
    }
}
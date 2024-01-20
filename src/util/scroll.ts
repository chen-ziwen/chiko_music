

// 将屏幕滚动到顶部
export function scrollTop() {
    let timer: number | undefined = undefined;
    return (delay: number = 15, step: number = 35) => {
        if (timer) {
            clearInterval(timer)
        }
        timer = window.setInterval(() => {
            document.documentElement.scrollTop -= step;
            if (document.documentElement.scrollTop <= 0) {
                document.documentElement.scrollTop = 0;
                clearInterval(timer);
            }
        }, delay)
    }
}

// 将屏幕滚动到顶部 类写法
export class ScrollTop {
    private timer: number | undefined;
    public readonly scroll: (delay?: number, step?: number) => void;
    constructor() {
        this.timer = undefined;
        this.scroll = (delay = 15, step = 35) => {
            if (this.timer) {
                clearInterval(this.timer)
            }
            this.timer = window.setInterval(() => {
                document.documentElement.scrollTop -= step;
                if (document.documentElement.scrollTop <= 0) {
                    document.documentElement.scrollTop = 0;
                    clearInterval(this.timer);
                }
            }, delay)
        }
    }
}


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
    public readonly scroll: (delay?: number, step?: number) => void;
    constructor() {
        this.timer = undefined;
        this.scroll = (delay = 15, step = 35) => {
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
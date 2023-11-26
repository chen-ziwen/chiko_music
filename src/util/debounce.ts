/**
 * @class 防抖，规定时间内多次只触发一次
 * @param {Function} fun  传入一个需要防抖的函数
 * @param {number} delay  规定时间
 * @param {boolean} immediate 触发的第一次是否立即执行
 * @return {Function}  返回一个函数
 */
export class Debounce {
    private timeout: number | null;
    constructor() {
        this.timeout = null;
    }
    use(fun: Function, delay: number, immediate = false): Function {
        return (...args: any) => {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            if (immediate) {
                if (!this.timeout) {
                    fun.apply(this, args)
                }
                this.timeout = window.setTimeout(() => {
                    this.timeout = null;
                }, delay);
                return;
            }
            this.timeout = window.setTimeout(() => {
                fun.apply(this, args);
                this.timeout = null;
            }, delay);
        }
    };
    cancel() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = null;
    }
}
/**
 * @class 节流，每间隔一段时间执行一次
 * @param {Function} fun  传入一个需要节流的函数
 * @param {number} delay  间隔的时间
 * @param {boolean} immediate 触发的第一次是否立即执行
 * @return {Function}  返回一个函数
 */
export class Throttle {
    public use: (fun: Function, delay: number, immediate?: boolean) => Function;
    constructor() {
        this.use = (fun, delay, immediate = false) => {
            let tiemout: NodeJS.Timeout | undefined = undefined;
            let flag = true;
            return (...args: any) => {
                if (immediate) {
                    fun.apply(this, args);
                    immediate = false;
                    return;
                }
                if (!flag) {
                    return;
                }
                flag = false;
                tiemout = setTimeout(() => {
                    fun.apply(this, args);
                    flag = true;
                    clearTimeout(tiemout as NodeJS.Timeout);
                }, delay)
            }
        }
    }
}
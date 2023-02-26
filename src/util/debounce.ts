/**
 * @class 防抖，规定时间内多次只触发一次
 * @param {Function} fun  传入一个需要防抖的函数
 * @param {number} delay  规定时间
 * @param {boolean} immediate 触发的第一次是否立即执行
 * @return {Function}  返回一个函数
 */
export class Debounce {
    public use: (fun: Function, delay: number, immediate?: boolean) => Function;
    constructor() {
        this.use = (fun, delay, immediate = false) => {
            let tiemout: NodeJS.Timeout | undefined = undefined;
            return (...args: any) => {
                if (immediate) {
                    fun.apply(this, args)
                    immediate = false;
                    return;
                }
                clearTimeout(tiemout as NodeJS.Timeout);
                tiemout = setTimeout(() => {
                    fun.apply(this, args);
                }, delay)
            }
        }
    }
}
// 防抖可以这么简写
export class Debounce2 {
    public use = (fun: Function, delay: number): Function => {
        let tiemout: NodeJS.Timeout | undefined = undefined;
        return (...args: any) => {
            clearTimeout(tiemout as NodeJS.Timeout);
            tiemout = setTimeout(() => {
                fun.apply(this, args);
            }, delay)
        }
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
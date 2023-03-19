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
        // ...args 相当于解构 arguments类数组，表示的就是传入的多个参数
        // 因为有的时候delay需要动态改变 所以需要写在这
        return (...args: any) => {
            if (this.timeout) {
                clearTimeout(this.timeout); // 清除定时器后，timeout仍然为数字
            }
            // immdiate为true时，立即执行，并把定时器设置为null
            if (immediate) {
                if (!this.timeout) {
                    // 一轮结束后，将timout设置为null，定时器便能继续立即执行
                    fun.apply(this, args)  // 这边的args是类数组，而apply刚好接收数组，同时它也会解构数组将它转为多个参数
                }
                this.timeout = window.setTimeout(() => {
                    this.timeout = null;
                }, delay);
                return;
            }
            // immdiate为false时，正常执行
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
        this.timeout = null; // 释放内存
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
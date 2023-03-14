
// localStorage 缓存数据
export class useStorage {
    public readonly set: (name: string, data: any) => void;
    public readonly get: (name: string) => any;
    // public readonly remove: (name: string, list: any[]) => void;
    public readonly clear: (name: string) => void;
    constructor() {
        this.set = (name, data) => {
            let cloneData = data;
            if (!name) {
                console.log('storge的set方法参数name不能为空');
                return;
            }
            if (typeof data !== 'string') {
                cloneData = JSON.stringify(cloneData);
            }
            window.localStorage.setItem(name, cloneData);
        };
        this.get = (name) => {
            if (!name) {
                return console.log('storge的get方法参数name不能为空');
            }
            // ?? 判断符只会判断null和undefined,左边不等于这两个返回左边，否则返回右边
            const data = window.localStorage.getItem(name);
            if (data) {
                return JSON.parse(data);
            }
            return data;
        };
        this.clear = (name) => {
            if (!name) {
                return console.log('storge的remove方法参数name不能为空');
            }
            window.localStorage.removeItem(name)
        }
    }
}
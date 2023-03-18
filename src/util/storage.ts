
// localStorage 缓存数据
export class useStorage {
    public readonly set: (name: string, data: any) => void;
    public readonly get: (name: string) => any;
    public readonly clear: (name: string) => void;
    constructor() {
        this.set = (name, data) => {
            let cloneData = data;
            if (typeof data !== 'string') {
                cloneData = JSON.stringify(cloneData);
            }
            window.localStorage.setItem(name, cloneData);
        };
        this.get = (name) => {
            // ?? 判断符只会判断null和undefined,左边不等于这两个返回左边，否则返回右边
            const data = window.localStorage.getItem(name);
            if (data) {
                return JSON.parse(data);
            }
            return data;
        };
        this.clear = (name) => {
            window.localStorage.removeItem(name);
        }
    }
}


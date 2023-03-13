
// localStorage 缓存数据
export class useStorage {
    public readonly set: (name: string, data: any) => void;
    public readonly get: (name: string, typedata?: any) => void;
    public readonly remove: (name: string) => void;
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
        this.get = (name, typeData = null) => {
            if (!name) {
                console.log('storge的get方法参数name不能为空');
                return;
            }
            let keepData = window.localStorage.getItem(name) ?? typeData;
            // ?? 判断符只会判断null和undefined,左边不等于这两个返回左边，否则返回右边
            if (keepData) {
                return JSON.parse(keepData)
            }
            return keepData;
        };
        this.remove = (name) => {
            if (!name) {
                console.log('storge的remove方法参数name不能为空');
                return;
            }
            window.localStorage.removeItem(name)
        }
    }
}
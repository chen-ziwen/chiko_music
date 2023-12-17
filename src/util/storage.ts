
// localStorage 缓存数据
export class useStorage {
    public readonly set: (name: string, data: any) => void;
    public readonly get: (name: string) => any;
    public readonly remove: (name: string) => void;
    public readonly clear: () => void;
    constructor() {
        this.set = (name, data) => {
            let cloneData = data;
            if (typeof data === "object" && data !== null) {
                cloneData = JSON.stringify(cloneData);
            }
            window.localStorage.setItem(name, cloneData);
        };
        this.get = (name) => {
            const data = window.localStorage.getItem(name);
            if (data) {
                return JSON.parse(data);
            }
            return data;
        };
        this.remove = (name) => {
            window.localStorage.removeItem(name);
        }
        this.clear = () => {
            window.localStorage.clear();
        }
    }
}

const storage = new useStorage();
export { storage };


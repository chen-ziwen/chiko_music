import { useStorage } from "./storage";

function findDeletSearch(list: string[], fun: any) {
    const index = list.findIndex(fun);
    if (index !== -1) {
        list.splice(index, 1);
    }
}

class useSearchStorage extends useStorage {
    deleteSingleSearch(storage: string, key: string) {
        const keylist = this.get(storage);
        findDeletSearch(keylist, (item: any) => item === key);
        this.set(storage, keylist);
    }

    addSingleSearch(storage: string, val?: string) {
        if (!this.get(storage)) {
            this.set(storage, []);
        } else {
            val && this.set(storage, [...new Set([val, ...this.get(storage)])]);
        }
    }
}

const searchStorage = new useSearchStorage();

export { searchStorage };
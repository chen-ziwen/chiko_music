import http from "./http";
import type { SearchHotDetail } from '../../models/detail'

/**
 * @method 搜索
 * @keywords 歌名关键字，可以多个
 */
export function getSearchSong(keywords: string, limit?: number, offset?: number, type?: number) {
    return http.get<{ result: any }>('/cloudsearch', { keywords, limit, offset, type })
}
/** 
 * @method 热搜列表(简略)
 */
export function getSearchHotDetail() {
    return http.get<{ data: SearchHotDetail[] }>('search/hot/detail')
    //{ data: SearchHotDetail[] } 在定义的| get<T>():promise<T> |泛型中 它是promise的reslove(参数)中的参数
    //async的返回值为promise 
    //await 返回值是promise，调用reslove函数时，reslove函数的参数
}

/**
 * @method 热搜列表(详细)
 */


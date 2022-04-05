import http from "./http";
import type { SearchHotDetail, RecommendList } from '../../models/detail'

//获取到的参数先用any表示,后续在去给她们添加类型。
// 不需要登陆的接口
/**
 * @function 搜索歌曲
 * @param keywords 歌名关键字,可以多个
 * @param limit 请求的数量
 * @param offset offset : 偏移数量,用于分页 ,如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param type 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
 */
export function getSearchSong(keywords: string, limit?: number, offset?: number, type?: number) {
    return http.get<{ result: any }>('/cloudsearch', { keywords, limit, offset, type })
}
/**
 * @function 获取歌曲的播放地址(重要)
 */
export function getSongUrl(id: string, br?: number) {
    return http.get<any>('/song/url', { id, br })
}

/** 
 * @function 获取热搜列表
 */
export function getSearchHotDetail() {
    return http.get<{ data: SearchHotDetail[] }>('search/hot/detail')
    //{ data: SearchHotDetail[] } 在定义的| get<T>():promise<T> |泛型中 它是promise的reslove(参数)中的参数
    //async的返回值为promise 
    //await 返回值是promise,调用reslove函数时,reslove函数的参数
}

/**
 * @function 获取推荐列表
 * @param limit 请求的数量
 */
export function getRecommendList(limit: number) {
    return http.get<{ result: RecommendList[] }>('/personalized', { limit })
}

/**
 * @function 获取搜索建议,搜索结果同时包含单曲,歌手,歌单,mv信息
 * @param keywords 关键词
 */
export function getSearchSuggest(keywords: string) {
    return http.get<any>('/search/suggest', { keywords })
}

/**
 * @function 获取歌曲评论
 * @param id 歌曲id 必选
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 */
export function getCommentMusic(id: number, limit?: number, offset?: number, before?: number) {
    return http.get<any>('/comment/music', { id, limit, offset, before })
}

/**
 * @function 获取歌手专辑(调用此接口,传入歌手id,可获得歌手专辑内容)
 * @param id 歌曲id必选
 * @param limit 取出数量,默认为 50
 * @param offset 偏移数量,用于分页,如 :( 评论页数 -1)*50,其中50为limit的值
 */
export function getArtistAlbum(id: number, limit?: number, offset?: number) {
    return http.get<any>('artist/album', { id, limit, offset })
}

/**
 * @function 获取歌手描述(调用此接口,传入歌手id,可获取歌手描述)
 * @param id 歌手id
 */
export function getArtistDesc(id: number) {
    return http.get<any>('/artist/desc', { id })

}

/**
 * @function 所有榜单内容摘要(调用此接口,可获取所有榜单内容摘要)
 */
export function getToplistDetail() {
    return http.get<any>('/toplist/detail')
}

/**
 * @function 歌手榜(调用此接口,可获取排行榜中的歌手榜)
 * @param type 地区：1: 华语 2: 欧美 3: 韩国 4: 日本
 */
export function getToplistArtist(type?: number) {
    return http.get<any>('/toplist/artist', { type })
}

/**
 * @function 热门歌手(调用此接口,可获取热门歌手数据)
 * @param  limit 取出数量,默认为 50
 * @param offset 偏移数量,用于分页,如 :( 页数 -1)\*50, 其中50为limit的值,默认为0
 */

export function getTopArtists(limit?: number, offset?: number) {
    return http.get<any>('/top/artists', { limit, offset })
}

/**
 * @function 歌手分类列表(调用此接口,可获取歌手分类列表)
 * @param limit 返回数量,默认为30
 * @param offset 偏移数量,用于分页,如 :( 页数 -1)*30, 其中30为limit的值,默认为0
 * @param initial 按首字母索引查找参数, 如 /artist/list?type=1&area=96&initial=b 返回内容将以 name 字段开头为 b 或者拼音开头为 b 为顺序排列, 热门传-1,#传0
 * @param type 取值:-1:全部 1:男歌手 2:女歌手 3:乐队
 * @param area 取值:-1:全部 7华语 96欧美 8:日本 16韩国 0:其他
 */
export function getArtistAList(limit?: number, offset?: number, initial?: string, type?: number, area?: number) {
    return http.get<any>('/artist/list', { limit, offset, initial, type, area })
}

/**
 * @function 获取歌手单曲(调用此接口,传入歌手id,可获得歌手部分信息和热门歌曲)
 * @param id 歌手id,可由搜索接口获得
 */
export function getArtists(id: number) {
    return http.get<any>('/artists', { id })
}

/**
 * @function 全部mv(调用此接口,可获取全部mv)
 * @param area 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * @param type 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
 * @param order 排序,可选值为上升最快,最热,最新,不填则为上升最快
 * @param limit 取出数量,默认为30
 * @param offset 偏移数量,用于分页,如:(页数-1)\*50,其中50为limit的值,默认为0
 */
export function getMvAll(area?: string, type?: number, order?: number, limit?: number, offset?: number) {
    return http.get<any>('/mv/all', { area, type, order, limit, offset })
}

/**
 * @function 获取歌手mv(调用此接口,传入歌手id,可获得歌手mv信息,具体mv播放地址可调用`/mv`传入此接口获得的mvid来拿到,如:`/artist/mv?id=6452`,`/mv?mvid=5461064`)
 * @param id 歌手id, 可由搜索接口获得
 */
export function getArtistMv(id: number) {
    return http.get<any>('/artist/mv', { id })
}
/**
 * @function 获取mv数据(调用此接口,传入mvid(在搜索音乐的时候传type=1004获得),可获取对应MV数据,数据包含mv名字,歌手,发布时间,mv视频地址等数据,其中mv视频网易做了防盗链处理,可能不能直接播放,需要播放的话需要调用'mv地址'接口)
 * @param mvid mv的id 通过'/artist/mv'接口可以获取到mvid
 */
export function getMvDetail(mvid: number) {
    return http.get<any>('/mv/detail', { mvid })
}

/**
 * @function 获取mv地址
 * @param id mv的id
 */
export function getMvUrl(id: number) {
    return http.get<any>('/mv/url', { id })
}

/**
 * @function 获取相似歌手(调用此接口,传入歌手id,可获得相似歌手)
 * @param id 歌手id
 */
export function getSimiArtist(id: number) {
    return http.get<any>('/simi/artist', { id })
}

/**
 * @function 获取相似歌单(调用此接口,传入歌曲id,可获得相似歌单)
 * @param id 歌曲id
 */
export function getSimiPlaylist(id: number) {
    return http.get<any>('/simi/playlist', { id })
}

/**
 *@function 相似mv(调用此接口,传入mvid可获取相似mv)
 *@param mvid mv的id
 */
export function getSimiMv(mvid: number) {
    return http.get<any>('/simi/mv', { mvid })
}

/**
 * @function 获取相似音乐(调用此接口,传入歌曲id,可获得相似歌曲)
 * @param id 歌曲id
 */
export function getSimiSong(id: number) {
    return http.get<any>('/simi/song', { id })

}

/**
 * @function 获取最近5个听了这首歌的用户
 * @param id 歌曲id
 */
export function getSimiUser(id: number) {
    return http.get<any>('/simi/user', { id })
}

/**
 * @function 喜欢音乐(调用此接口,传入音乐id,可喜欢该音乐)
 * @param id 歌曲id
 * @param like 布尔值,默认为true即喜欢,若传 false,则取消喜欢
 */
export function getLike(id: number, like?: boolean) {
    return http.get<any>('/like', { id, like })
}

/**
 * @function 喜欢音乐列表(调用此接口,传入用户id,可获取已喜欢音乐id列表数组)
 * @param uid 用户id
 */
export function getLikeList(uid: number) {
    return http.get<any>('likelist', { uid })
}

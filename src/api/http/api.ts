import http from "./http";
import type { SingerListType, SearchHotDetailType, RecommendList } from "@/models";


/**
 * @function 搜索歌曲
 * @param keywords 歌名关键字,可以多个
 * @param limit 请求的数量
 * @param offset offset : 偏移数量,用于分页 ,如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param type 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
 */
export function getSearchSong(params: { keywords: string, limit?: number, offset?: number, type?: number }) {
    return http.get<any>('/cloudsearch', params);
}

/**
 * @function 默认搜索关键词
 */
export function getSearchDefault() {
    return http.get<any>('/search/default');
}

/**
 *@function  搜索列表简略
 */
export function getSearchHot() {
    return http.get<any>('/search/hot');
}

/** 
 * @function 获取热搜列表
 */
export function getSearchHotDetail() {
    return http.get<{ data: SearchHotDetailType[] }>('search/hot/detail')
}


/**
 * @function 获取搜索建议,搜索结果同时包含单曲,歌手,歌单,mv信息
 * @param keywords 关键词
 */
export function getSearchSuggest(keywords: string) {
    return http.get<any>('/search/suggest', { keywords })
}

/**
 * @function 获取歌曲的播放地址(重要)
 */
export function getSongUrl(id: number, br?: number) {
    return http.get<any>('/song/url', { id, br })
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
 * @function 调用此接口,可获取所有榜单
 */
export function getToplist() {
    return http.get<any>('/toplist')
}

// 榜单详情
/**
 * @function 请使用[歌单详情](#获取歌单详情)接口,传入排行榜 id 获取排行榜详情数据(排行榜也是歌单的一种)
 * @param id 榜单id
 */
export function getToplistDetailAll(id: number) {
    return http.get<any>('/top/list', { id })
}

/**
 * @function 所有榜单内容摘要(调用此接口,可获取所有榜单内容摘要)
 * @param type 1:华语 2.欧美 3.韩国 4.日本
 */
export function getToplistDetail(type?: number) {
    return http.get<any>('/toplist/detail', { type })
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

// 接收分开的参数

// export function getArtistAList(limit?: number, offset?: number, initial?: string, type?: number, area?: number) {
//     return http.get<any>('/artist/list', { limit, offset, initial, type, area })
// }

// 接收参数对象
export function getArtistAList(param: { limit?: number, offset?: number, initial?: string | number, type?: number, area?: number }) {
    return http.get<any>('/artist/list', param)
}

/**
 * @function 获取歌手单曲(调用此接口,传入歌手id,可获得歌手部分信息和热门歌曲)
 * @param id 歌手id,可由搜索接口获得
 */
export function getArtists(id: number) {
    return http.get<any>('/artists', { id })
}

/**
 * @function 获取歌手mv(调用此接口,传入歌手id,可获得歌手mv信息,具体mv播放地址可调用`/mv`传入此接口获得的mvid来拿到,如:`/artist/mv?id=6452`,`/mv?mvid=5461064`)
 * @param id 歌手id, 可由搜索接口获得
 */
export function getArtistMv(id: number, limit: number) {
    return http.get<any>('/artist/mv', { id, limit })
}

/**
  * @function 获取相似歌手(调用此接口,传入歌手id,可获得相似歌手)
  * @param id 歌手id
  */
export function getSimiArtist(id: number) {
    return http.get<any>('/simi/artist', { id })
}

/**
 * @function 获取歌手专辑(调用此接口,传入歌手id,可获得歌手专辑内容)
 * @param id 歌手id
 * @param limit 取出数量,默认为 50
 * @param offset 偏移数量,用于分页,如 :( 评论页数 -1)*50,其中50为limit的值
 */
export function getArtistAlbum(id: number, limit?: number, offset?: number) {
    return http.get<any>('/artist/album', { id, limit, offset })
}

/**
 * @function 获取歌手描述(调用此接口,传入歌手id,可获取歌手描述)
 * @param id 歌手id
 */
export function getArtistDesc(id: number) {
    return http.get<any>('/artist/desc', { id })
}

/**
 * @function 获取歌手详情 调用此接口 , 传入歌手 id, 可获得获取歌手详情
 * @param id 歌手id
 */
export function getArtistDetail(id: number) {
    return http.get<any>('/artist/detail', { id })
}

/**
 * @function 获取专辑内容
 * @param id 专辑id
 */
export function getAlbum(id: number, time: number) {
    return http.get<any>('/album', { id, time })
}
/**
 * @function 获取专辑评论数
 * @param id 专辑id
 * @param limit 取出评论数
 * @param offset 偏移数量
 * @param before 分页参数
 */
export function getCommentAlbum(id: number, limit?: number, offset?: number, before?: string) {
    return http.get<any>('/comment/album', { id, limit, offset, before })
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
export function getMvAllUp(param: { area?: string, type?: string, order?: string, limit?: number, offset?: number }) {
    return http.get<any>('/mv/all', param);
}
export function getMvExclusive(limit: number) {
    return http.get<any>('/mv/exclusive/rcmd', { limit })
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
 * @function mv排行(调用此接口,可获取mv排行)
 
 * @param limit 取出数量,默认为30
 */
export function getTopMv(limit?: number) {
    return http.get<any>('/top/mv', { limit })
}
/**
 * @function 推荐Mv
 * 
 */

export function getPersonalizedMv() {
    return http.get<any>('/personalized/mv')
}

/**
 * @function 获取mv的点赞转发评论数
 */
export function getMvDetailInfo(mvid: number, time: number) {
    return http.get<any>('/mv/detail/info', { mvid, timestamp: time })
}

/**
 * @function 获取MV评论
 */
export function getCommentMv(param: { id: number, limit?: number, offset?: number, timestamp?: number }) {
    return http.get<any>('/comment/mv', param)
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

/**
 * @function 推荐新音乐(调用此接口,可获取推荐新音乐)
 * @param limit 取出数量,默认为10(不支持offset)
 */
export function getPersonalizedNewsong(limit?: number) {
    return http.get<any>('/personalized/newsong', { limit })
}

/**
 * @function 获取推荐歌单
 * @param limit 取出数量,默认为30(不支持 offset)
 */
export function getRecommendList(limit?: number) {
    return http.get<{ result: RecommendList[] }>('/personalized', { limit })
}

/**
 * @function 歌单(网友精选碟)
 * @param order 可选值为'new'和'hot',分别对应最新和最热,默认为'hot' 
 * @param cat tag,比如 "华语 "、"古风 " 、"欧美 "、"流行 ",默认为"全部",可从歌单分类接口获取(/playlist/catlist)
 * @param limit 取出歌单数量 , 默认为 50
 * @param offset 偏移数量,用于分页,如 :( 评论页数 -1)\*50,其中50为limit的值
 */
export function getTopPlaylist(order?: string, cat?: string, limit?: number, offset?: number) {
    return http.get<any>('/playlist/hot', { order, cat, limit, offset })
}

/**
 * @function 获取歌手视频
 * @param id 歌手id
 * @param size 返回数量,默认为10
 * @param cursor 返回数据的cursor,默认为0,传入上一次返回结果的cursor,将会返回下一页的数据
 * @param order 排序方法,0表示按时间排序,1表示按热度排序,默认为0
 */
export function getArtistVideo(id: number, size?: number, cursor?: number, order?: number) {
    return http.get<any>('/artist/video', { id, size, cursor, order })
}

/**
 * @function 获取轮播图
 * @param type 默认0对应PC端
 */
export function getBanner(type?: number) {
    return http.get<any>('/banner', { type })
}

/**歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可
 *以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，
 *但是返回的 trackIds 是完整的，tracks 则是不完整的，可拿全部trackIds请求一次
  `song/detail` 接口获取所有歌曲的详情.

 * @function 获取歌单详情
 * @param id 歌单id
 * @param s 歌单最近的“s”个收藏者，默认为8
 * @param nowtime 时间戳
 */

export function getPlaylistDetail(id: number, s?: number, nowtime?: number) {
    return http.get<any>('/playlist/detail', { id, s, nowtime })
}

/**
 * 调用此接口,可获取歌单分类,包含 category 信息
 * @function 获取歌单分类
 */
export function getPlaylistCatlist() {
    return http.get<any>('/playlist/catlist')
}
/**
 * 调用此接口,可获取热门歌单分类,包含 category 信息
 * @function 热门歌单分类
 */
export function getPlaylistHot() {
    return http.get<any>('/playlist/hot')
}

/**
 * 调用此接口 , 可获取精品歌单
 * @function 获取精品歌单
 * @param cat `cat`: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为"全部",可从精品歌单标签列表接口获取(`/playlist/highquality/tags`)
 * @param limit 取出歌单数量
 * @param before 分页参数,取上一页最后一个歌单的 `updateTime` 获取下一页数据
 */
export function getHighquality(cat?: string, limit?: number, before?: number) {
    return http.get<any>('/top/playlist/highquality', { cat, limit, before })
}

// 歌单网友精选碟
export function getTopPlaylistDetail(cat: string, limit: number, offset: number, order?: "new" | "hot") {
    return http.get<any>('./top/playlist', { cat, limit, offset, order })
}
// 获取精品歌单标签
export function getHighQualityTags() {
    return http.get<any>('/playlist/highquality/tags')
}

/**
 * 调用此接口,传入歌单 id 可获取相关歌单
 * @function 相关歌单推荐
 * @param id 歌单id
 */
export function getRelatedPlaylist(id: number) {
    return http.get<any>('/related/playlist', { id })
}

/**
 * 由于网易云接口限制，歌单详情只会提供 10 首歌，通过调用此接口，传入对应的歌单`id`，即可获得对应的所有歌曲
 * @function 获取歌单全部歌曲
 * @param id 歌单id
 * @param {numer} limit 限制获取歌曲的数量，默认值为当前歌单的歌曲
 * @param {number} offset 默认值为0
 */
export function getPlaylistTrackAll(id: number, limit?: number, offset?: number, nowtime?: number) {
    return http.get<any>('/playlist/track/all', { id, limit, offset, nowtime })
}

/**
 * 调用后可获取歌单详情动态部分,如评论数,是否收藏,播放数
 * @function 歌单详情动态 
 * @param id 歌单id
 */
export function getDetailDynamic(id: number) {
    return http.get<any>('/playlist/detail/dynamic', { id })
}

/**
 * 说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 `,` 隔开), 可获得歌曲详情(dt为歌曲时长)
 * 
 * @function 获取歌曲详情
 * @param ids 音乐 id, 如 `ids=347230`
 */
export function getSongDetail(ids: string, timestamp?: number | string) {
    return http.get<any>('/song/detail', { ids })
}

/**
 * @function 获取歌单评论
 * @param id 歌单id
 * @param limit 默认20
 * @param offset 分页
 * @param before 评论数超过5000有用
 */
export function getCommentPlaylist(id: number, limit?: number, offset?: number, before?: number) {
    return http.get<any>('/comment/playlist', { id, limit, offset, before })
}

/**
 * @function 歌单收藏者
 * @returns 
 */
export function getPlaylistSubscribers(id: number, limit?: number, offset?: number) {
    return http.get<any>('/playlist/subscribers', { id, limit, offset })
}

// 最新mv
export function getMvFirst(limit?: number, area?: string) {
    return http.get<any>('/mv/first', { limit, area })
}

/**
 * @function 获取每日推荐歌单（调用此接口，可获得每日推荐歌单）
 */
export function getRecommendResource() {
    return http.get<any>('/recommend/resource')
}

/**
 * @function 获取每日推荐歌曲（调用此接口，可获得每日推荐歌曲）
 */
export function getRecommendSongs() {
    return http.get<any>('/recommend/songs')
}


/**
 * @function 获取歌词
 */

export function getLyric(id: number) {
    return http.get<any>('/lyric', { id });
}


import http from "./http";

// 需要登陆的接口

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
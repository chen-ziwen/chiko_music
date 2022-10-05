// 对图片的大小进行处理
export function imgurl(url: string, param: string = "100") {
    if (!url) {
        return '/assets/images/ava.jpeg';
    }
    return `${url}?param=${param}y${param}`
}


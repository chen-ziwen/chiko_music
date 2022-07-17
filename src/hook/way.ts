
export function imgurl(url: string, param: number) {
    if (!url) {
        return '/assets/images/ava.jpeg';
    }
    return `${url}?param = ${param}y${param}`
}
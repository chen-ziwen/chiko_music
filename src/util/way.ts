// 对图片的大小进行处理
export function imgurl(url: string, param: string = "100") {
    if (!url) {
        return '/assets/images/ava.jpeg';
    }
    return `${url}?param=${param}y${param}`
}

// 随机播放，这样索引可能重复
export function randomNum(min: number, max: number) {
    let num = Math.floor((Math.random() * (max - min)) + min);
    return num;
}

// 最多显示三个歌手名
export function changeData(msg: { name: string }[]) {
    return msg.map(item => item.name).slice(0, 3).join("\n");
}

export function changeNum(num: number, point: number = 0) {
    let numStr = num.toString()
    // 十万以内直接返回
    if (numStr.length < 6) {
        return numStr
    }
    //大于8位数是亿
    else if (numStr.length > 8) {
        let decimal = numStr.substring(
            numStr.length - 8,
            numStr.length - 8 + point
        )
        return parseFloat(parseInt(num / 100000000 + '') + '.' + decimal) + '亿'
    }
    //大于6位数是十万 (以10W分割 10W以下全部显示)
    else if (numStr.length > 5) {
        let decimal = numStr.substring(
            numStr.length - 4,
            numStr.length - 4 + point
        )
        return parseFloat(parseInt(num / 10000 + '') + '.' + decimal) + '万'
    }
};


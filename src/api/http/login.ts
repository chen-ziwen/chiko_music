import http from "./http";

/**
 * @function 手机登陆
 * @param phone 手机号码
 * @param password 登陆密码
 * @param countrycode 国家码
 * @param md5_password md5 密码加密
 * @param captcha 验证码 // 可发送验证码登陆
 */
export function phoneGet(phone: number, captcha: number, countrycode?: number, md5_password?: string) {
    return http.get<any>('/login/cellphone', { phone, captcha, countrycode, md5_password })
}

export function phonePost(phone: number, captcha: number, countrycode?: number, md5_password?: string) {
    return http.post<any>('/login/cellphone', { phone, captcha, countrycode, md5_password })
}

/**
 * @function 发送验证码
 * @param phone  手机号码
 * @param ctcode 国家编号
 */
export function captchaSend(phone: number, ctcode?: number) {
    return http.get<string | number>('/captcha/sent', { phone, ctcode })
}

/**
 * @function 验证验证码
 * @param phone 手机号码
 * @param captcha 验证码
 * @param ctcode 国家编号
 */
export function captchaVerify(phone: number, captcha: number, ctcode?: number) {
    return http.get<any>('/captcha/verify', { phone, captcha, ctcode })
}

// 二维码登陆

export function loginKey(timestamp: number) {
    return http.get<any>('/login/qr/key', { timestamp });
}

export function loginQrCreate(key: string, qrimg: boolean, timestamp: number) {
    return http.get<any>('/login/qr/create', { key, qrimg, timestamp });
}

export function loginQrCheck(key: string, timestamp: number) {
    return http.get<any>('/login/qr/check', { key, timestamp });
}

// 登录状态

export function loginStatus() {
    return http.get<any>('/login/status')
}
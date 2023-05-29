export let isDev: boolean = true; // 默认为开发环境

if (import.meta.env.MODE === 'development') {
    isDev = true;
} else if (import.meta.env.MODE === 'production') {
    isDev = false;
}
// 将所有的通用方法都导入到这个index.ts文件中，同时一次性暴露出去。
// 优点：将所有方法都统一到了一个文件中。

export * from './debounce'; // 防抖节流方法
export * from './storage'; // 本地存储方法
export * from './scroll'; // 滚动方法
export * from './time';  // 时间处理方法
export * from './way';  // 一些简单的小方法集合
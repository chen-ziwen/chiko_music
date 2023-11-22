// import { Directive } from "vue-demi";
export default {
    // 当点击的元素不在绑定元素内部时 触发回调函数
    'closeOutside': {
        mounted(el: any, binding: any) {
            el.oustsideEvent = (event: any) => {
                // 在内部点击时 不反应
                if (el == event.target || el.contains(event.target)) {
                    return;
                }
                // 在外部点击时 触发回调函数
                if (binding.value && typeof binding.value == 'function') {
                    binding.value();
                }
            };
            document.addEventListener('click', el.oustsideEvent);
        },
        unmounted(el: any) {
            document.removeEventListener('click', el.oustsideEvent);
            delete el.oustsideEvent;
        }
    },
    // 改变背景色
    'color': {
        mounted(el: HTMLElement, binding: any) {
            el.style.background = binding.value;
        },
    }
} as Record<string, any>;
<template>
    <div class="login">
        <div class="land-module">
            <span class="login-tips">打开手机网易云APP 扫码登录</span>
            <img :src="qrSrc" alt="二维码丢失啦">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { phoneGet, loginKey, loginQrCheck, loginQrCreate } from '@/api';
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import { useStorage } from '@/hook';

const router = useRouter();
const qrSrc = ref<string>('');
let timer: number | undefined;
const storage = new useStorage();

async function qrLogin() {
    const time = Date.now();
    const { data } = await loginKey(time);
    const { data: qrData } = await loginQrCreate(data.unikey, true, time);
    qrSrc.value = qrData.qrimg;
    qrCheck(data.unikey)
}

async function qrCheck(key: string) {
    clearInterval(timer);
    timer = window.setInterval(() => {
        const time = Date.now();
        loginQrCheck(key, time).then(res => {
            console.log('我是登录界面', res);
            if (res.code == 803) {
                storage.set('cookie', res.cookie)
                storage.set('loginStatu', true);
                router.replace({ name: 'discover' })
                clearInterval(timer);
            }
        }).catch((e) => {
            console.log('登陆失败', e);
        })
    }, 2500)
}


onMounted(async () => {
    await qrLogin();
})
onUnmounted(() => {
    clearInterval(timer)
})

</script>

<style lang="scss" scoped>
.login {
    position: relative;
    background-color: $color;
    width: 100%;
    height: 100vh;

    .land-module {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .login-tips {
            margin-bottom: 10px;
        }
    }
}
</style>
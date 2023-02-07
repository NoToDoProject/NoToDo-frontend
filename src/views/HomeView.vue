<script lang="ts" setup>

const changeTheme = (value: string) => {
    window.postMessage(value)
}

</script>

<template>
    <n-button @click="changeTheme('auto')">自动主题</n-button>
    <n-button @click="changeTheme('dark')">暗黑主题</n-button>
    <n-button @click="changeTheme('light')">明亮主题</n-button>
</template>
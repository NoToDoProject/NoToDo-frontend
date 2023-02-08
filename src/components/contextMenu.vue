<script lang="ts" setup>
// 右键菜单组件
import type { PropType, VNode, RendererNode, RendererElement } from 'vue'
import type { DropdownOption, DropdownDividerOption, DropdownRenderOption, DropdownGroupOption } from 'naive-ui'
const props = defineProps({
    location: {
        type: Object as PropType<{ x: number, y: number }>,
        required: true,
    },
    options: {
        type: Array as PropType<Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption>>,
        required: true,
    },
    show: {
        type: Boolean as PropType<boolean>,
        required: true,
    },
    onClickoutside: {
        type: Function as PropType<(e: MouseEvent) => void>,
        required: false,
    },
    onSelect: {
        type: Function as PropType<(key: string | number, option: DropdownOption) => void>,
        required: false,
    }
})

</script>

<template>
    <n-dropdown placement="bottom-start" trigger="manual" :x="location.x" :y="location.y" :options="options"
        :show="show" :on-clickoutside="onClickoutside" @select="onSelect" style="min-width:150px;" />
</template>
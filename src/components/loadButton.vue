<script lang="ts" setup>
import { onMounted, h } from 'vue'

const props = defineProps(
    {
        time: {
            type: Number,
            default: 1000
        },
        backgroundColor: {
            type: String,
            default: '#409eff'
        },
        text: {
            type: String,
            default: '加载中'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'success'
        },
        size: {
            type: [String, Number],
            default: 'medium'
        },
        round: {
            type: Boolean,
            default: false
        },
        circle: {
            type: Boolean,
            default: false
        },
        block: {
            type: Boolean,
            default: false
        },
        onClick: {
            type: Function,
            default: () => { }
        },
        onConfirm: {
            type: Function,
            default: () => { }
        },
        onCancel: {
            type: Function,
            default: () => { }
        }
    }
)

</script>

<template>
    <n-button 
    :size = "size" 
    :type = "type" 
    :round = "round" 
    :circle = "circle" 
    :block = "block" 
    :disabled = "disabled" 
    @click = "onClick"
    style="background-color: aliceblue; background-size: 200% 100%; background-position: 100%; background-image: linear-gradient(90deg, #409eff 0%, #409eff 50%, #409eff 100%); animation: n-self-load-button-active 1s linear infinite; border: none;"
    >
        <slot>{{ text }}</slot>
    </n-button>
</template>

<style>
.n-self-load-button .active {
    background-size: 200% 100%;
    background-position: 100%;
}

@keyframes n-self-load-button-active {
    from {
        background-position: 100%;
    }

    to {
        background-position: 0%
    }
}
</style>
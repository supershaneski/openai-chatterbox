<script setup>

const props = defineProps({
    progress: {
        type: Number,
        default: 0,
    },
    lineColor: {
        type: String,
        default: '#00DC82',
    },
    lineWidth: {
        type: Number,
        default: 2,
    },
    textBackColor: {
        type: String,
        default: '#222222',
    },
    size: {
        type: Number,
        default: 100,
    }
})

const { progress } = toRefs(props)

const p1 = ref(90)
const p2 = ref(90)
const p3 = ref(90)
const p4 = ref(90)

function setPercentValues(value) {

    p1.value = value < 25 ? 90 - Math.round((value / 25)*90) : 0
    p2.value = value < 25 ? 90 : value >= 50 ? 0 : 90 - Math.round(((value - 25) / 25)*90)
    p3.value = value < 50 ? 90 : value >= 75 ? 0 : 90 - Math.round(((value - 50) / 25)*90)
    p4.value = value < 75 ? 90 : value >= 100 ? 0 : 90 - Math.round(((value - 75) / 25)*90)

}

watch(progress, (value) => {

    setPercentValues(value)

})

onMounted(() => {

    setPercentValues(progress.value)

})

</script>

<template>
    <div class="circular-progress" :style="{
        width: `${size}px`,
        height: `${size}px`,
    }">
        <div class="inner">
            <div class="segment" :style="{
                transform: `rotate(270deg) skew(${p1}deg)`,
                backgroundColor: props.lineColor,
            }" />
            <div class="segment" :style="{
                transform: `rotate(0deg) skew(${p2}deg)`,
                backgroundColor: props.lineColor,
            }" />
            <div class="segment" :style="{
                transform: `rotate(90deg) skew(${p3}deg)`,
                backgroundColor: props.lineColor,
            }" />
            <div class="segment" :style="{
                transform: `rotate(180deg) skew(${p4}deg)`,
                backgroundColor: props.lineColor,
            }" />
            <div class="display" :style="{
                left: `${props.lineWidth}px`,
                top: `${props.lineWidth}px`,
                width: `calc(100% - (2 * ${props.lineWidth}px))`,
                height: `calc(100% - (2 * ${props.lineWidth}px))`,
            }">
                <div class="text">&nbsp;</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.circular-progress {
    position: relative;
    width: 200px;
    height: 200px;
    box-sizing: border-box;
}
.inner {
    background-color: #999;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
}
.segment {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vw;
    transform-origin: 0 0;
    z-index: 1;
}
.display {
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (prefers-color-scheme: dark) {
    .display {
        background-color: #222222;
    }
    .inner {
        background-color: #fff;
    }
}
</style>
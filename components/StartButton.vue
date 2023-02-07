<script setup>
import MicrophoneIcon from './MicrophoneIcon.vue';
import MicrophoneOffIcon from './MicrophoneOffIcon.vue';

const props = defineProps({
    disabled: {
        Type: Boolean,
        default: false,
    },
    isStarted: {
        Type: Boolean,
        default: false,
    }
})

const emit = defineEmits(["click"])

function handleClick() {
    if(props.disabled) return
    emit('click')
}

const iconColor = computed(() => {
    return props.isStarted ? "#00DC8299" : "#66666699" //#FFD167
})

</script>

<template>
    <div class="start-button" @click="handleClick" :style="{ borderColor: iconColor, }">
        <MicrophoneOffIcon v-if="props.disabled" size="32px" color="#6669" />
        <MicrophoneIcon v-else size="32px" :color="iconColor" />
    </div>
</template>

<style scoped>
.start-button {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-width: 3px;
    border-style: solid;
    border-radius: 50%;
    background-color: #f5f5f599;
    position: relative;
    width: 100px;
    height: 100px;
    font-size: 1rem;
    color: #fffa;
    outline: none;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (prefers-color-scheme: dark) {
    .start-button {
        background-color: #3339;
    }
}
</style>
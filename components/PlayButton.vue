<script setup>
import CircularProgress from './CircularProgress.vue'
import PlayIcon from './PlayIcon.vue'
import PauseIcon from './PauseIcon.vue'

const props = defineProps({
    playState: {
        Type: String,
        default: 0,
    },
    progress: {
        Type: Number,
        default: 0,
    },
    disabled: {
        Type: Boolean,
        default: false,
    }
})

const emit = defineEmits(['click'])

const isDarkMode = ref(true)

const buttonColor = computed(() => {

    let hasDarkPreference = false

    if(process.client) {

        try {
            hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        } catch(err) {
            console.log(err)
        }

    }
    
    const baseColor = hasDarkPreference ? '#ffffff' : '#999'
    return props.progress === 0 ? baseColor : '#00DC82'
})

function handleClick() {
    if(props.disabled) return
    emit('click')
}

onMounted(() => {

    const hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (hasDarkPreference) {
        isDarkMode.value = true
    }

})

</script>

<template>
    <div class="play-button">
        <div class="progress"><CircularProgress :size="30" :progress="props.progress" /></div>
        <div class="icon" @click="handleClick">
            <Transition>
                <PlayIcon v-if="props.playState === 0" size="20px" :color="buttonColor" />
            </Transition>
            <Transition>
                <PauseIcon v-if="props.playState === 1" size="20px" />
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.play-button {
    position: relative;
}
.progress, .icon {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.progress {
    z-index: 1;
}
.icon {
    z-index: 2;
    cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: display 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  display: none;
}
</style>
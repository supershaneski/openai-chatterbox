<script setup>
//import { ref, computed, watch, onMounted, toRefs } from 'vue'

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    start: {
        type: Boolean,
        default: false,
    }, 
    visible: {
        type: Boolean,
        default: false,
    }
})

const { start, text, visible } = toRefs(props)
const timer = ref(null)
const index = ref(0)
const displayText = ref('')

onMounted(() => {
    
    clearInterval(timer)

    if(visible.value) {
        displayText.value = text.value
        return
    }

    if (!start.value) return

    timer.value = setInterval(() => {

        if(index.value >= text.value.length) {
            visible.value = true
            clearInterval(timer.value)
        } else {

            displayText.value += text.value.charAt(index.value)
            index.value++

        }

    }, 50)

})

</script>

<template>
    <div class="type-writer-text">{{ displayText }}</div>
</template>

<style scoped>
.type-writer-text {
    /*background-color: #f5f5f566;*/
    position: relative;
}
</style>
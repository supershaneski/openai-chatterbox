<script setup>
defineProps({
    color: {
        Type: String,
        default: '#00DC82'
    },
    size: {
        Type: String,
        default: '1em'
    }
})
</script>

<template>
    <svg :fill="color" stroke-width="0" viewBox="0 0 16 16" :height="size" :width="size" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
    </svg>
</template>
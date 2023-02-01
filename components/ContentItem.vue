<script setup>
const props = defineProps({
    text: {
        Type: String,
    }
})

const contentData = computed(() => {
    let token = props.text.split("]")
    return {
        datetime: token[0] + "]",
        textdata: token.length > 1 ? token[1].trim() : ""
    }
})

</script>

<template>
    <div class="content-item">
        <span class="content-item-datetime">{{ contentData.datetime }}</span>&nbsp;{{ contentData.textdata }}
    </div>
</template>

<style scoped>
.content-item {
    position: relative;
}
.content-item-datetime {
    font-weight: 600;
    font-size: 0.8rem;
    color: #555;
}

@media screen and (max-width: 400px) {
    .content-item-datetime {
        font-size: 0.7rem;
        display: block;
    }
}
</style>
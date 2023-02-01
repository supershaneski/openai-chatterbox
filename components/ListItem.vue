<script setup>
import ContentItem from './ContentItem.vue';
import PlayButton from './PlayButton.vue'
import { getDisplayDateTime } from '../lib/utils'

const props = defineProps({
    datetime: {
        Type: String,
        default: '',
    },
    texts: {
        Type: Array,
        default: [],
    },
    disabled: {
        Type: Boolean,
        default: false,
    },
    progress: {
        Type: Number,
        default: 0,
    },
    playState: {
        Type: Number,
        default: 0,
    }
})

const emit = defineEmits(['click'])

</script>

<template>
    <div class="list-item">
        <div class="datetime">{{ getDisplayDateTime(props.datetime) }}</div>
        <div class="contents-panel">
            <div class="contents-text">
                <ContentItem v-for="(txt, i) in texts" :text="txt" class="content-item" :key="i" />
            </div>
            <div class="contents-action">
                <div class="action-button">
                    <PlayButton :playState="props.playState" :progress="props.progress" :disabled="disabled" @click="emit('click')" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-item {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 6px;
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    margin: 0.4rem;
    padding: 1rem;
    box-sizing: border-box;
}

.contents-panel {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.contents-text {
    margin-right: 0.5rem;
}
.datetime {
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
}
.content-item-datetime {
    font-weight: 600;
    font-size: 0.8rem;
    color: #555;
}

.contents-action {
    position: relative;
}
.action-button {
    position: relative;
    width: 30px;
    height: 30px;
}

@media (prefers-color-scheme: dark) {
    .list {
        background-color: #333333;
    }
    .list-item {
        background-color: #222222;
    }
}
</style>
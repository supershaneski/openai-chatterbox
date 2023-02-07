<script setup>
import ListItem from '~~/components/ListItem.vue';
import AnimatedBars from '~~/components/AnimatedBars.vue';
import StartButton from '~~/components/StartButton.vue';

const MAX_PAUSE = 3000
const MIN_DECIBELS = -45
const INTERVAL_TIME = 100

const appStore = useAppStore()

const selected = ref('')
const playState = ref(0)
const progress = ref(0)

let timer = null

const isStarted = ref(false)
const isReady = ref(false)
const errorMessage = ref('')

const isRecording = ref(false)
const startCountdown = ref(false)
const count = ref(0)
const animFrame = ref(null)

const mediaRec = ref(null)
const chunks = ref([])

const audioFile = ref(null)

const countTimer = ref(null)

const abortController = ref(null)

const audioRef = ref(null)

const dataCount = ref(0)

const data = ref([])

let createdDateTime = ''
let dateTimeCreated = ''

function startAudio() {

    let inc = audioRef.value.duration * 1000 / 100

    timer = setInterval(() => {

        progress.value+=1

        if(progress.value>=100) {

            clearInterval(timer)
            playState.value = 0
            progress.value = 0
            selected.value = ''

            audioRef.value.remove()
            audioRef.value = null

        }

    }, inc)

}

async function handleClick(id, url) {

    if(selected.value === id && playState.value === 1) {

        await audioRef.value.pause()

        clearInterval(timer)

        playState.value = 0

        return
    }

    if(selected.value.length === 0) {
        progress.value = 0
    } else {
        if(selected.value !== id) {
            return
        } else {

            playState.value = 1

            await audioRef.value.play()

            startAudio()

            return
        }
    }

    audioRef.value = new Audio()

    audioRef.value.addEventListener('loadedmetadata', async () => {

        if(audioRef.value.duration === Infinity) {

            selected.value = id

            audioRef.value.currentTime = 1e101
            audioRef.value.addEventListener('timeupdate', getDuration)

        } else {

            try {

                await audioRef.value.play()

                playState.value = 1
                selected.value = id
                
                startAudio()

            } catch(err) {
                console.log(err)
            }

        }

    })

    audioRef.value.src = url

}

async function getDuration() {

    audioRef.value.currentTime = 0
    audioRef.value.removeEventListener('timeupdate', getDuration)

    try {

        await audioRef.value.play()

        playState.value = 1

        startAudio()

    } catch(err) {
        console.log(err)
    }

}

function setEnabledState(id) {
    if(playState.value === 0) return true
    return id === selected.value ? true : false
}

function handleStart() {

    if(isStarted.value) {

        isStarted.value = false

        if(isRecording.value === true) {

            try {
                mediaRec.value.stop()
            } catch(err){
                console.log(err)
            }

        }

        isRecording.value = false
        startCountdown.value = false

    } else {
        
        isStarted.value = true

    }

}

function handleError() {

    errorMessage.value = "Error initializing Media device"

}

function handleStream(stream) {

    isReady.value = true

    mediaRec.value = new MediaRecorder(stream)
    mediaRec.value.addEventListener('dataavailable', handleData)
    mediaRec.value.addEventListener("stop", handleStop)

    checkAudioLevel(stream)

}

function checkAudioLevel(stream) {

    const audioContext = new AudioContext()
    const audioStreamSource = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.minDecibels = MIN_DECIBELS
    audioStreamSource.connect(analyser)

    const bufferLength = analyser.frequencyBinCount
    const domainData = new Uint8Array(bufferLength)

    const detectSound = () => {

        let soundDetected = false

        analyser.getByteFrequencyData(domainData)

        for (let i = 0; i < bufferLength; i++) {
            if (domainData[i] > 0) {
                soundDetected = true
            }
        }

        if(soundDetected === true) {

            if(isRecording.value === false) {

                if(isStarted.value) {
                    
                    createdDateTime = (new Date()).toISOString()

                    startCountdown.value = false
                    isRecording.value = true

                    mediaRec.value.start()

                }

            } else {
                if(startCountdown.value === true) {
                    startCountdown.value = false
                    count.value = 0
                }
            }

        } else {

            if(isRecording.value === true) {

                if(startCountdown.value === true) {

                    if(count.value >= MAX_PAUSE) {
                        
                        if(isStarted.value) {

                            startCountdown.value = false
                            count.value = 0
                            isRecording.value = false

                            mediaRec.value.stop()
                            
                        }
                    }

                } else {
                    startCountdown.value = true
                }
            }

        }

        animFrame.value = window.requestAnimationFrame(detectSound)

    }

    animFrame.value = window.requestAnimationFrame(detectSound)

}

function handleData(e) {
    chunks.value.push(e.data)
}

function handleStop() {

    dateTimeCreated = createdDateTime

    const blob = new Blob(chunks.value, {type: 'audio/webm;codecs=opus'})
    chunks.value = []

    audioFile.value = new File([blob], `file${Date.now()}.m4a`);

}

async function uploadFile(file) {

    dataCount.value++

    let formData = new FormData()
    formData.append("file", file)
    formData.append("datetime", dateTimeCreated)

    try {

        const response = await $fetch("/api/transcribe", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
            },
            body: formData,
            signal: abortController.value.signal,
        })

        dataCount.value--
        if(dataCount.value < 0) dataCount.value = 0

        if(response.status !== "error") {

            data.value.push({
                id: response.pid,
                datetime: response.datetime,
                texts: response.out,
                url: response.url,
            })
        }
    
    } catch(err) {
        console.log(err)

        dataCount.value = 0
    }

}

const sortedData = computed(() => data.value.sort((a, b) => {
    if(a.datetime > b.datetime) return -1
    if(a.datetime < b.datetime) return 1
    return 0
}))

watch(audioFile, (value) => {

    uploadFile(value)

})

watch(startCountdown, (value) => {
    
    clearInterval(countTimer.value)

    if(value === true) {
        
        count.value = 0

        countTimer.value = setInterval(() => {
            
            count.value+=INTERVAL_TIME

        }, INTERVAL_TIME)

    }

})

onMounted(async () => {

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({ audio: true }).then(handleStream).catch(handleError)

    } else {

        errorMessage.value = "Media devices not supported"

    }

    abortController.value = new AbortController()

    const items = appStore.value.items
    if(items.length > 0) {
        data.value = items.map(item => {
            return {
                id: item.pid,
                datetime: item.datetime,
                texts: item.out,
                url: item.url,
            }
        })
    }
    
})

onBeforeUnmount(() => {

    try {
        abortController.value.abort()
        window.cancelAnimationFrame(animFrame.value)
    } catch(err) {
        console.log(err)
    }

})

</script>

<template>
    <div class="container">
        <div class="header">
            <h1 class="title">Chatterbox</h1>
            <div class="record-status-panel">
                <div v-if="isReady" class="record-panel">
                    <div class="record-status">
                        <AnimatedBars :start="isRecording" />
                    </div>
                    <div class="record-indicator" :class="{blink: dataCount }">&#9679;</div>
                </div>
                <span v-else class="error">{{ errorMessage }}</span>
            </div>
        </div>
        <div class="main">
            <div v-if="data.length > 0" class="list">
                <ListItem v-for="item in sortedData" 
                :key="item.id" 
                :datetime="item.datetime" 
                :texts="item.texts"
                :disabled="!setEnabledState(item.id)"
                @click="handleClick(item.id, item.url)"
                :playState="selected === item.id ? playState : 0"
                :progress="selected === item.id ? progress : 0"
                />
            </div>
            <div v-else class="list-empty">
                <span>No items found</span>
            </div>
        </div>
        <div class="action-panel">
            <StartButton @click="handleStart" :disabled="!isReady" :isStarted="isStarted" />
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    width: 100vw;
    max-width: 800px;
    height: 100vh;
    overflow: hidden;
}
.header {
    position: relative;
    height: 40px;
    padding: 0 1rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.record-status-panel {
    position: relative;
    width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    justify-content: flex-end;
}
.record-panel {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.record-status {
    position: relative;
    width: 50px;
    height: 20px;
}
.record-indicator {
    position: relative;
    font-size: 0.5rem;
    color: #e6e6e6;
    margin-left: 0.5rem;
}
.blink {
    color: #f66;
    animation: blinkAni 0.9s infinite;
}
@keyframes blinkAni {
    from { color: #ff6; }
    to { color: #f66; }
}
.error {
    font-size: 0.7rem;
    color: #ff6767;
    padding-top: 5px;
}
.title {
    font-size: 1.1rem;
    margin: 0;
}

.main {
    position: relative;
    height: calc(100% - 40px);
    padding-bottom: 1rem;
    box-sizing: border-box;
}
.list {
    background-color: #f5f5f5;
    border-radius: 5px;
    position: relative;
    margin: 0 1rem 0rem 1rem;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
}
.list-empty {
    background-color: #f5f5f5;
    border-radius: 5px;
    position: relative;
    margin: 0 1rem 0rem 1rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}
.action-panel {
    border-radius: 50%;
    position: fixed;
    right: calc((100% - 100px)/2);
    bottom: 2rem;
    width: 100px;
    height: 100px;
    z-index: 10;
    box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
    .list, .list-empty {
        background-color: #333333;
    }
    .record-indicator {
        color: #333;
    }
}

</style>
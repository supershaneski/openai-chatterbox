// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            charset: 'utf-8',
            viewport: 'maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0, width=device-width, user-scalable=0',
            title: 'Chatterbox',
            meta: [
                { name: 'description', content: 'A speech transcriber app powered by OpenAI Whisper built using Nuxt 3.' }
            ],
        }
    },
    //modules: ["formidable"],
    runtimeConfig: {
        public: {
            appTitle: 'Chatterbox'
        }
    },
    css: [
        '~/assets/main.css'
    ]
})
